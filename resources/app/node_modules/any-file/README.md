# Any-File

Node.js library to copy files between several storage sources (ftp, http/https, s3, ssh, local, ...)


## Getting Started

Please, follow next instructions to get a working copy of the project up and running on your local machine for development and testing purposes. This is an unstable release. Please, don't use in production environments.


### Prerequisities

You need to install nodejs >= 5.8.0 on your machine:

```
sudo apt-get install nodejs
```

Probably, library will work with older nodejs versions.


### Installing

Please, execute next command to install package

```
npm install any-file
```

After that, include the module in your code:

```
var AnyFile = require('any-file');
```


## Running the tests

To run tests, please execute

```
make test
```

All test use public files shared on internet. So, you have to find no problems when testing.


### Samples

This module allow to copy files between different storage systems.

All queries begin with calling function *from* to define source file to copy

```
from("protocol://username:password@server/path/to/file")
```

and define destination with method *to*

```
to("protocol://username:password@server/path/to/file", callback)
```

Next protocols are accepted by the library:
* ftp
* http, https (only download)
* scp
* s3 
* local file system

Additionally, if no protocol schema is defined, local system is assumed. 

You can compress and uncompress your files in all operations. Next are supported compression formats: zip, gzip. 
Please, take in consideration that some zip files could have wrong headers. In those cases, file will be renamed to final extension only.

Next sources are accepted by the library:

* ftp://username:password@ftpserver.com/file.zip (auth)
* http://webserver.com/path/to/file.csv (direct)
* https://username:password@webserver.com/path/to/file.csv (auth)
* scp://username:password@sshserver.com/path/to/file.csv (auth)
* scp://username@sshserver.com/path/to/file.csv (authorized. Add your host public_key to username .authorized_keys)
* s3://accesskey:secretkey@s3.amazon.com/bucket/path/to/file.csv
* /etc/host (local file)

You can copy ftp file to local file system
```
var af = new AnyFile();
var fromFile ="ftp://anonymous:miemail%40gmail.com@speedtest.tele2.net/100KB.zip";
var toFile = "100KB.zip";
af.from(fromFile).to(toFile, function(err, res) {
	if (res) {
		console.log("File copied!");
	} else {
		console.log("File not copied!");
	}
});
```

Or http file with needed auth to local file system
```
var af = new AnyFile();
var fromFile = "http://anonymous:miemail%40gmail.com@speedtest.tele2.net/100KB.zip";
var toFile = "100KB.zip";
af.from(fromFile).to(toFile, function(err, res) {
	if (res) {
		console.log("File copied!");
	} else {
		console.log("File not copied!");
	}
});
```

Or copy from sftp to s3 
```
var af = new AnyFile();
var fromFile = "sftp://demo:password@test.rebex.net:/readme.txt";
var toFile = "s3://AKIAIZHM3T2QFIRSVQ5A:gxxxYv+PuyihUrg0EqJ8U1C0pxBwxZGPO0U2DuhX@s3.amazon.com/any-file-us/readme.txt";
af.from(fromFile).to(toFile, function(err, res) {
	if (res) {
		console.log("File copied!");
	} else {
		console.log("File not copied!");
	}
});
```

Or copy from sftp to s3 gzipped file
```
var af = new AnyFile();
var fromFile = "sftp://demo:password@test.rebex.net:/readme.txt";
var toFile = "s3://AKIAIZHM3T2QFIRSVQ5A:gxxxYv+PuyihUrg0EqJ8U1C0pxBwxZGPO0U2DuhX@s3.amazon.com/any-file-us/readme.txt.gz";
af.from(fromFile).to(toFile, function(err, res) {
	if (res) {
		console.log("File copied!");
	} else {
		console.log("File not copied!");
	}
});
```

You can find more code samples on samples folder using accepted protocols (http, ftp, s3, scp and local). Please, check it out.


## Debugging

You can debug the library this way

```
DEBUG=app node youfile.js
```

This will show debugging messages on console.


## Todo

On future releases, next features will be added:
- events (start, progress, end, error) instead of callbacks

## Contributions

Please, feel free to send pull requests or comments to the project. Contributions are welcome!


## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 


## Authors

* **Miquel Colomer** - *Initial work* - [mcolomer](https://github.com/mcolomer)

See also the list of [contributors](https://github.com/mcolomer/any-file/contributors) who participated in this project.

## Who is using this repo?

Please, let me know if you are using this repository in a production environment. Next sites use this module:

- [uProc](https://uproc.io/) - Data quality service with a huge catalog to Normalize, Validate, Enrich and Deduplicate your data

## License

This project is licensed under the Apache License - see the [LICENSE](LICENSE) file for details

