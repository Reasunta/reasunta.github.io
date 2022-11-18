class GameSaver {
    constructor() {
        this.defaultFilename = 'backgamut_game.csv';
        this.fileHandleSupported = ('showSaveFilePicker' in window);
        this.fileHandle = undefined;
    }

    loadFromFile = async function(deserializer) {
        if(!this.fileHandleSupported) return this.uploadFile(deserializer);

        let options = {
            suggestedName : this.fileHandle ? this.fileHandle.name : this.defaultFilename,
            types: [ { description: 'CSV File', accept: { 'text/csv': ['.csv'] } }]
        }

        this.fileHandle = await window.showOpenFilePicker(options);
        if (!this.fileHandle || this.fileHandle.length == 0) this.uploadFile(deserializer);

        this.fileHandle = this.fileHandle.pop();
        this.defaultFilename = this.fileHandle.name;
        deserializer(await (await this.fileHandle.getFile()).text())
    }

    saveToCurrentFile = function(content) {
        if(!this.fileHandleSupported) return this.downloadFile(content);
        if(this.fileHandle == undefined) return this.saveToNewFile(content);

        this.writeContentToFileHandle(this.fileHandle, content);
        // @todo(v.radko): change popup to good-looking and without buttons
        // possible implementation: https://getbootstrap.com/docs/4.0/components/alerts/
        window.alert(`Saved '${this.fileHandle.name}'!`);
    }

    saveToNewFile = async function(content) {
        if (!this.fileHandleSupported) return downloadFile(content);

        let options = {
            suggestedName : this.fileHandle ? this.fileHandle.name : this.defaultFilename,
            types: [ { description: 'CSV File', accept: { 'text/csv': ['.csv'] } }]
        }
        this.fileHandle = await window.showSaveFilePicker(options);

        this.fileHandle
            ? await this.writeContentToFileHandle(this.fileHandle, content)
            : this.downloadFile(content);
    }

    writeContentToFileHandle = async function(fileHandle, content) {
        const writer = await fileHandle.createWritable();
        await writer.write(content);
        await writer.close();
    }

    downloadFile = function(content) {
        let encodedUri = encodeURI(`data:text/csv;charset=utf-8,${content}`);
        let link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", this.defaultFilename);
        document.body.appendChild(link); // Required for FF
        link.click();

        setTimeout(() => document.body.removeChild(link), 0);
    }

    uploadFile = function(deserializer) {
        let result = document.createElement('input');
        result.type = 'file';
        result.style.visibility = "hidden";

        result.onchange = function(e) {
           let file = e.target.files[0];
           this.defaultFilename = file.name;

           let reader = new FileReader();
           reader.readAsText(file,'UTF-8');

           reader.onload = readerEvent => deserializer(readerEvent.target.result);
        }.bind(this);

        document.body.appendChild(result);
        result.click();
        setTimeout(() => document.body.removeChild(result), 0);
    }
}
