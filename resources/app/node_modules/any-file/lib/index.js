'use strict';

/**
 * Module dependencies.
 */

var url = require('url'),
    debug = require('debug')('app'),
    net = require('net'),
    zlib = require('zlib'),
    yazl = require('yazl'),
    yauzl = require('yauzl'),
    util = require('util'),
    path = require('path'),
    Client = require('ftp'),
    fs = require('fs'),
    request = require('request'),
    aws = require('aws-sdk'),
    scpClient = require('scp2'),
    EventEmitter = require('events');

function AnyFile(opt) {
    var self = this;

    var fromProtocol = "";
    var toProtocol = "";
    var fromFile = "";
    var toFile = "";
    var temporalFile = "";


    var options = opt || {};

    var __compressFile = function (from, to, callback) {
        __processFileCompressOrUncompress(from, to, true, callback);
    };

    var __uncompressFile = function (from, to, callback) {
        __processFileCompressOrUncompress(from, to, false, callback);
    };

    var __processFileCompressOrUncompress = function (from, to, compress, callback) {
        if (compress) {
            if (__hasGzipExtension(to)) {
                __processFileCompressOrUncompressGzip(from, to, compress, callback);
            } else if (__hasZipExtension(to)) {
                __processFileCompressOrUncompressZip(from, to, compress, callback);
            } else {
                return callback(null, true);
            }
        } else {
            if (__hasGzipExtension(from)) {
                __processFileCompressOrUncompressGzip(from, to, compress, callback);
            } else if (__hasZipExtension(from)) {
                __processFileCompressOrUncompressZip(from, to, compress, callback);
            } else {
                return callback(null, true);
            }
        }
    };

    var __isOpenPort = function (host, port, callback) {
        var client = net.Socket();
        var err = "";
        client.setTimeout(5000);
        client.connect({
            host: host,
            port: port
        });

        client.on('connect', function (err) {
            client.destroy();
        });
        client.on('error', function (e) {
            err = e;
            client.destroy();
        });
        client.on('timeout', function (socket) {
            err = "Error: timeout";
            client.destroy();
        });
        client.on('close', function () {
            return callback(err, err.length);
        });
    };

    var __processFileCompressOrUncompressGzip = function (from, to, compress, callback) {
        var oldFile = from;
        var newFile = from + (compress ? ".gz" : ".uncompressed");
        var method = compress ? zlib.createGzip() : zlib.createGunzip();
        try {
            var rstream = fs.createReadStream(oldFile);
            var wstream = fs.createWriteStream(newFile);
            rstream.pipe(method).pipe(wstream);
            wstream.on('finish', function (err, res) {
                debug(oldFile + "-" + newFile);
                __replaceOldByNewFile(oldFile, newFile, callback);
            });
        } catch (e) {
            debug(e);
            return callback(null, true);
        }
    };

    var __processFileCompressOrUncompressZip = function (from, to, compress, callback) {
        var oldFile = from;
        var newFile = from + (compress ? ".zip" : ".uncompressed");
        debug("__processFileCompressOrUncompressZip: " + oldFile + "-" + newFile);
        if (compress) {
            var zipfile = new yazl.ZipFile();
            zipfile.addFile(oldFile, __cleanNonBasicExtensions(oldFile));
            zipfile.outputStream.pipe(fs.createWriteStream(newFile)).on("close", function () {
                __replaceOldByNewFile(oldFile, newFile, callback);
            });
            zipfile.end();
        } else {
            debug("uncompress: " + oldFile);
            yauzl.open(oldFile, {
                lazyEntries: true
            }, function (err, zipfile) {
                if (!err) {
                    zipfile.readEntry();
                    zipfile.on("entry", function (entry) {
                        zipfile.openReadStream(entry, function (err, readStream) {
                            if (err) throw err;
                            // ensure parent directory exists
                            readStream.pipe(fs.createWriteStream(newFile));
                            readStream.on("end", function () {
                                __replaceOldByNewFile(oldFile, newFile, callback);
                            });
                        });
                    });
                } else {
                    return callback(err, false);
                }
            });
        }
    };

    var __replaceOldByNewFile = function (oldFile, newFile, callback) {
        fs.unlink(oldFile, function (err, res) {
            fs.rename(newFile, oldFile, function (err, res) {
                callback(err, res);
            });
        });
    };

    var __preTo = function (from, to, callback) {
        //Different extensions
        if (!__haveSameExtension(from, to)) {
            if (__hasCompressedExtension(from) && __hasCompressedExtension(to)) {
                debug('uncompress+compress');
                __uncompressFile(from, to, function (err, res) {
                    __compressFile(from, to, function (err, res) {
                        return callback(null, true);
                    });
                });
            } else if (__hasCompressedExtension(to)) {
                debug('compress');
                __compressFile(from, to, callback);
            } else if (__hasCompressedExtension(from)) {
                debug('uncompress');
                __uncompressFile(from, to, callback);
            } else {
                debug('simple');
                return callback(null, true);
            }
        } else {
            return callback(null, true);
        }
    };

    var __to = function (destinationFile, callback) {
        toFile = destinationFile;
        __setToProtocol(destinationFile);
        __fromGeneric(function (err, res) {
            //We need this to remove intermediate file
            var previousFile = temporalFile;
            if (!err && res) {
                __preTo(temporalFile, toFile, function (err, res) {
                    __toGeneric(function (err, res) {
                        //Remove temporalFile after to
                        fs.unlink(previousFile, function (err) {
                            return callback(null, true);
                        });
                    });
                });
            } else {
                return callback(err, false);
            }
        });
    };

    var __getExtension = function (file) {
        file = __cleanBakExtension(file);
        return path.extname(file);
    };

    var __haveSameExtension = function (from, to) {
        return __getExtension(from) === __getExtension(to);
    };

    var __getExtensionPosition = function (file, extension) {
        return file.length - extension.length;
    };

    var __cleanNonBasicExtensions = function (file) {
        var supportedExtensions = ['gz', 'zip'];
        supportedExtensions.forEach(function (ext) {
            file = __cleanBakExtension(file, '.' + ext);
        });

        return file;
    };

    var __cleanBakExtension = function (file, prefix) {
        var to_replace = ".bak";
        if (prefix !== "" && prefix !== null && prefix !== undefined) {
            to_replace = prefix + to_replace;
        }
        return file.replace(to_replace, "");
    };

    var __hasGzipExtension = function (file) {
        var extension = ".gz";
        file = __cleanBakExtension(file);
        return file.indexOf(extension) === __getExtensionPosition(file, extension);
    };

    var __hasBzip2Extension = function (file) {
        var extension = ".bz2";
        file = __cleanBakExtension(file);
        return file.indexOf(extension) === __getExtensionPosition(file, extension);
    };

    var __hasZipExtension = function (file) {
        var extension = ".zip";
        file = __cleanBakExtension(file);
        return file.indexOf(extension) === __getExtensionPosition(file, extension);
    };

    var __hasCompressedExtension = function (file) {
        file = __cleanBakExtension(file);
        return __hasZipExtension(file) || __hasGzipExtension(file);
    };

    var __isSupportedProtocol = function (file) {
        var supportedProtocols = ['s3', 'ftp', 'http', 'https', 'scp', 'file'];
        var protocol = __getProtocol(file);

        return supportedProtocols.indexOf(protocol) !== -1;
    };

    var __getProtocol = function (file) {
        var data = file.split(":");

        return data.length > 1 ? data[0] : "";
    };

    var __setFromProtocol = function (file) {
        if (__isSupportedProtocol(file)) {
            fromProtocol = __getProtocol(file);
        } else {
            fromProtocol = "file";
        }
    };

    var __setToProtocol = function (file) {
        if (__isSupportedProtocol(file)) {
            toProtocol = __getProtocol(file);
        } else {
            toProtocol = "file";
        }
    };

    var __fromGeneric = function (callback) {
        if (fromProtocol === 's3') {
            __fromS3(callback);
        } else if (fromProtocol === 'ftp') {
            __fromFtp(callback);
        } else if (fromProtocol === 'http' || fromProtocol === 'https') {
            __fromHttp(callback);
        } else if (fromProtocol === 'scp') {
            __fromSftp(callback);
        } else if (fromProtocol === 'file') {
            __fromLocalFile(callback);
        }
    };

    var __toGeneric = function (callback) {
        if (toProtocol === 's3') {
            __toS3(callback);
        } else if (toProtocol === 'ftp') {
            __toFtp(callback);
        } else if (toProtocol === 'http' || toProtocol === 'https') {
            __toHttp(callback);
        } else if (toProtocol === 'scp') {
            __toSftp(callback);
        } else if (toProtocol === 'file') {
            __toLocalFile(callback);
        }
    };

    var __containsSlashAtCredentials = function (str) {
        //Credentials present
        if (str.indexOf("@") !== -1) {
            var substring = str.split("@")[0].split("://")[1];
            return substring.indexOf("/") !== -1;
        } else {
            return false;
        }
    };

    var __parseUrl = function (file) {
        var parsed = url.parse(file);
        var host = parsed.host;
        var port = parsed.port;
        var auth = parsed.auth;
        var remoteFile = parsed.path;

        if (__containsSlashAtCredentials(file)) {
            auth = file.split("@")[0].split("://")[1];
            parsed = url.parse(file.replace(auth, "")); //avoid conflicts
            host = parsed.host;
            port = parsed.port;
            remoteFile = parsed.path;
        }

        var username = auth && auth.indexOf(":") !== -1 ? auth.split(":")[0] : "";
        var password = auth && auth.indexOf(":") !== -1 ? auth.split(":")[1] : "";
        if (!auth) {
            if (file.indexOf("@") !== -1) {
                var data = file.split("@")[0].split("/");
                auth = data[data.length - 1];
                username = auth && auth.indexOf(":") !== -1 ? auth.split(":")[0] : "";
                password = auth && auth.indexOf(":") !== -1 ? auth.split(":")[1] : "";
            }
        }

        return {
            host: host,
            port: port,
            auth: auth,
            username: username,
            password: password,
            remoteFile: remoteFile
        };
    };

    var __fromSftp = function (callback) {
        var parsed = __parseUrl(fromFile);

        scpClient.scp({
            host: parsed.host,
            username: parsed.username,
            password: parsed.password,
            path: parsed.remoteFile
        }, temporalFile, function (err) {
            return callback(err, !err);
        });
    };

    var __toSftp = function (callback) {
        var parsed = __parseUrl(toFile);

        scpClient.scp(temporalFile, {
            host: parsed.host,
            username: parsed.username,
            password: parsed.password,
            path: parsed.remoteFile
        }, function (err) {
            return callback(err, !err);
        });
    };

    var __getAuthRaw = function (file) {
        var data = file.split("@");
        data = data[0].split("/");
        return data[data.length - 1];
    };

    var __getUsernameRaw = function (file) {
        var username = "";
        var auth = __getAuthRaw(file);
        if (auth.indexOf(":") !== -1) {
            username = auth.split(":")[0];
        }

        return username;
    };

    var __getPasswordRaw = function (file) {
        var password = "";
        var auth = __getAuthRaw(file);
        if (auth.indexOf(":") !== -1) {
            password = auth.split(":")[1];
        }

        return password;
    };

    var __initS3 = function (file) {
        var parsed = __parseUrl(file);

        var host = parsed.host;
        var port = parsed.port;
        var auth = parsed.auth;
        var accessKey = auth && auth.indexOf(":") !== -1 ? auth.split(":")[0] : "";
        if (accessKey === '') {
            accessKey = __getUsernameRaw(file);
        }
        var secretKey = auth && auth.indexOf(":") !== -1 ? auth.split(":")[1] : "";
        if (secretKey === '') {
            secretKey = __getPasswordRaw(file);
        }
        var data = parsed.remoteFile.split("/");
        var bucket = data[1];
        var remoteFile = data.slice(2).join("/");

        if (accessKey !== "" && secretKey !== "" && bucket !== "" && remoteFile !== "") {
            aws.config.update({
                accessKeyId: accessKey,
                secretAccessKey: secretKey,
                //region: 'us-west-1'
            });
            var params = {
                params: {
                    Bucket: bucket,
                    Key: remoteFile
                }
            };

            var client = new aws.S3(params);

            return {
                client: client,
                params: params
            }

        } else {
            throw new Error("invalid params");
        }
    };

    var __fromS3 = function (callback) {
        try {
            var cfg = __initS3(fromFile);
            var file = fs.createWriteStream(temporalFile);
            file.on('close', function (err, data) {
                return callback(null, true);
            });
            file.on('error', function (err) {
                return callback(err, false);
            });
            cfg.client.getObject(cfg.params.params).createReadStream().pipe(file);
        } catch (e) {
            debug(e);
            if (callback) {
                return callback(e, false);
            }
        }
    };

    var __toS3 = function (callback) {
        try {
            var cfg = __initS3(toFile);
            var file = fs.createReadStream(temporalFile);
            cfg.client.upload({
                Body: file
            }).
            send(function (err, data) {
                return callback(null, true);
            });
        } catch (e) {
            debug(e);
            if (callback) {
                return callback(e, false);
            }
        }
    };

    var __fromHttp = function (callback) {
        var file = fs.createWriteStream(temporalFile);
        //debug(temporalFile);
        file.on('finish', function () {
            file.close(function () {
                if (callback) {
                    return callback(null, true);
                }
            });
        });
        file.on('error', function () {
            return callback(null, false);
        });
        try {
            request(fromFile).on('error', function (err) {
                return callback(err, false);
            }).pipe(file).on('error', function (err) {
                if (callback) {
                    return callback(err, false);
                }
            });
        } catch (e) {
            return callback(e, false);
        }
    };

    var __toHttp = function (callback) {
        //if (callback) {callback(err, false);}
        throw new Error("toHttp not implemented");
    };

    var __copyLocalFile = function (srcFile, dstFile, callback, deleteSrcFile) {
        deleteSrcFile = deleteSrcFile || false;
        var rd = fs.createReadStream(srcFile);
        rd.on("error", function (err) {
            return callback(err, !err);
        });

        if (fs.existsSync(dstFile)) {
            fs.unlinkSync(dstFile);
        }
        var wr = fs.createWriteStream(dstFile);
        wr.on("error", function (err) {
            return callback(err, !err);
        });
        wr.on("close", function (ex) {
            if (deleteSrcFile && fs.existsSync(srcFile)) {
                fs.unlinkSync(srcFile);
            }
            return callback(null, true);
        });
        rd.pipe(wr);
    };

    var __fromLocalFile = function (callback) {
        __copyLocalFile(fromFile, temporalFile, callback);
    };

    var __toLocalFile = function (callback) {
        if (temporalFile !== toFile) {
            __copyLocalFile(temporalFile, toFile, callback, true);
        } else {
            return callback(null, true);
        }
    };

    var __initFtp = function (file, callback) {
        var parsed = __parseUrl(file);
        parsed.port = parsed.port || 21;
        __isOpenPort(parsed.host, parsed.port, function (err, res) {
            if (err) {
                return callback(err, false);
            } else {
                var config = {
                    host: parsed.host,
                    port: parsed.port,
                    user: parsed.username,
                    password: parsed.password
                };

                var remoteFile = parsed.remoteFile.replace("/", "");
                while (remoteFile.indexOf('%20') >= 0) {
                    remoteFile = remoteFile.replace('%20', ' ');
                }

                return callback(null, {
                    config: config,
                    remoteFile: remoteFile
                });
            }
        });
    };

    var __fromFtp = function (callback) {
        __initFtp(fromFile, function (err, cfg) {
            if (!err) {
                var c = new Client();
                //timeout, auth, ...
                c.on('error', function (err) {
                    return callback(err, false);
                });
                c.on('ready', function () {
                    c.get(cfg.remoteFile, function (err, stream) {
                        if (err) {
                            return callback(err, false);
                        } else {
                            stream.once('close', function () {
                                c.end();
                                return callback(null, true);
                            });
                            stream.pipe(fs.createWriteStream(temporalFile));
                        }
                    });
                });
                c.connect(cfg.config);
            } else {
                return callback(err, false);
            }
        });
    };

    var __move = function (from, to, callback) {
        var source = fs.createReadStream(from);
        var dest = fs.createWriteStream(to);

        source.pipe(dest);
        source.on('end', function () {
            return callback(null, true);
        });
        source.on('error', function (err) {
            return callback(err, false);
        });
    };

    var __toFtp = function (callback) {
        __initFtp(toFile, function (err, cfg) {
            if (!err) {
                var c = new Client();
                //timeout, auth, ...
                c.on('error', function (err) {
                    return callback(err, false);
                });
                c.on('ready', function () {
                    c.put(temporalFile, cfg.remoteFile, function (err) {
                        if (err) {
                            return callback(err, false);
                        } else {
                            c.end();
                            return callback(null, true);
                        }
                    });
                });
                c.connect(cfg.config);
            } else {
                return callback(err, false);
            }
        });
    };

    var __from = function (sourceFile) {
        fromFile = sourceFile;
        var fromParsed = __parseUrl(fromFile);
        temporalFile = path.basename(fromParsed.remoteFile) + ".bak";
        //If previously exists
        if (fs.existsSync(temporalFile)) {
            fs.unlinkSync(temporalFile);
        }
        __setFromProtocol(sourceFile);

        return {
            to: __to
        };
    };

    return {
        from: __from
    };
};

/**
 * Export `AnyFile`.
 */

module.exports = AnyFile;
