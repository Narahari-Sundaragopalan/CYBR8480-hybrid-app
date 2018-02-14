import Component from '@ember/component';

export default Component.extend({
  actions: {
    uploadFile() {
      console.log('uploadFile is called');
      window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, successCallback, errorCallBack)


      function successCallback(fs) {
        console.log('file system open: ' + fs.name);
        var fileName = "uploadSource.txt";
        var dirEntry = fs.root;
        dirEntry.getFile(fileName, { create: true, exclusive: false }, function (fileEntry) {
          // Write something to the file before uploading it.
          writeFile(fileEntry);
        }, onErrorCreateFile);
      }


      function onErrorCreateFile() {
          console.log("Create file fail...");
        }


      function errorCallBack() {
          console.log("File system fail...");
      }


      function writeFile(fileEntry, dataObj) {
        // Create a FileWriter object for our FileEntry (log.txt).
        fileEntry.createWriter(function (fileWriter) {
          fileWriter.onwriteend = function () {
            console.log("Successful file write...");
            upload(fileEntry);
          };
          fileWriter.onerror = function (e) {
            console.log("Failed file write: " + e.toString());
          };
          if (!dataObj) {
            dataObj = new Blob(['Test Cordova File Transfer Plugin'], { type: 'text/plain' });
          }
          fileWriter.write(dataObj);
        });
      }


      function upload(fileEntry) {
          var fileURL = fileEntry.toURL();
          var success = function (r) {
              console.log("Successful upload...");
              console.log("Code = " + r.responseCode);
              console.log("Response = " + r.response);
              console.log("Sent = " + r.bytesSent);
              alert("File uploaded successfully with response code: " + r.responseCode + "and bytesSent: " + r.bytesSent);
          }
          var fail = function (error) {
              alert("An error has occurred: Code = " + error.code);
          }
          var options = new FileUploadOptions();
          options.fileKey = "file";
          options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
          options.mimeType = "text/plain";
          var params = {};
          params.value1 = "test";
          params.value2 = "param";
          options.params = params;
          var ft = new FileTransfer();
          ft.upload(fileURL, encodeURI("http://www.filedropper.com/"), success, fail, options);
      }
    },

    downloadFile() {
        var fileTransfer = new FileTransfer();
        var uri = encodeURI("http://s14.postimg.org/i8qvaxyup/bitcoin1.jpg");
        var fileURL = cordova.file.externalApplicationStorageDirectory + 'myFile.png';
        fileTransfer.download(
          uri,
          fileURL,
          function (entry) {
              console.log("Successful download...");
              console.log("download complete: " + entry.toURL());
              alert("File downloaded successfully: " + entry.toURL());
          },
          function (error) {
            console.log("download error source " + error.source);
            console.log("download error target " + error.target);
            console.log("download error code " + error.code);
          },
          null,
          {

          }
    );
  },
},

});
