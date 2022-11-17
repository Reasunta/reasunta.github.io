class GameSaver {
    constructor() {
        this.defaultFilename = 'backgamut_game.csv';
        this.fileHandleSupported = ('showSaveFilePicker' in window);
        this.fileHandle = undefined;
    }

    getLoadInput = function(deserializer) {
        let result = document.createElement('input');
        result.type = 'file';

        result.onchange = e => {
           let file = e.target.files[0];
           let reader = new FileReader();
           reader.readAsText(file,'UTF-8');

           reader.onload = readerEvent => deserializer(readerEvent.target.result);
        }

        return result;
    }

    saveToCurrentFile = function(content) {
        if (this.fileHandle == undefined) return this.saveToNewFile(content);

        this.writeContentToFileHandle(this.fileHandle, content);
        // @todo(v.radko): change popup to good-looking and without buttons
        // possible implementation: https://getbootstrap.com/docs/4.0/components/alerts/
        window.alert(`Saved '${this.fileHandle.name}'!`);
    }

    saveToNewFile = async function(content) {
        if (this.fileHandleSupported) {
            let options = {
                suggestedName : this.fileHandle ? this.fileHandle.name : this.defaultFilename,
                types: [ { description: 'CSV File', accept: { 'text/csv': ['.csv'] } }]
            }

            this.fileHandle = await window.showSaveFilePicker(options);

            if (this.fileHandle) {
                await this.writeContentToFileHandle(this.fileHandle, content);
            } else {
                // Could not open FileHandle, fallback to downloading file with default name.
                this.downloadFile();
            }
        } else {
            this.downloadFile();
        }
    }

    writeContentToFileHandle = async function(fileHandle, content) {
        const writer = await fileHandle.createWritable();
        await writer.write(content);
        await writer.close();
    }

    downloadFile = function() {
        let encodedUri = encodeURI(content);
        let link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", this.defaultFilename);
        document.body.appendChild(link); // Required for FF
        link.click();

        setTimeout(() => document.body.removeChild(link), 0);
    }
}
