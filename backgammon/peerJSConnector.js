class PeerJSConnector {
    constructor() {
        this.peer = undefined;
        this.connection = undefined;

        this.state = {};
    }

    init = function(openConnCallback, getDataCallback) {
        this.openConnCallback = openConnCallback;
        this.getDataCallback = getDataCallback;
    }

    open = function() {
        this.peer = new Peer();

        this.peer.on("connection", function(conn) {
            if(this.connection) {
                console.log("Connection attempt will be declined cause of existing connection. Incoming peerJS id: " + conn.peer);
                conn.close();
                return;
            }

            this.receive(conn);

            conn.on('data', this.handleData.bind(this));
            conn.on("close", this.afterClose.bind(this));
            conn.on("error", this.error.bind(this));
        }.bind(this));

        this.peer.on("open", function(myPeerId) {
            console.log("PeerJS is opened. The id: " + myPeerId);

            this.state["myLink"] = this.generateLink(myPeerId);
            ConnectRenderer.render(this.state);

            let partnerPeerId = window.location.hash.replace('#', '');
            if(partnerPeerId) this.connect(partnerPeerId);
        }.bind(this));
    }

    connect = function(partnerPeerId) {
        if(this.connection) {
            console.log("Connection exists already. Partner peerJS id: " + this.connection.peer);
            return;
        }

        console.log("Try to connect with peerJS ID: " + partnerPeerId);
        let conn = this.peer.connect(partnerPeerId);

        conn.on('open', function() {this.receive(conn);}.bind(this));

        conn.on('data', this.handleData.bind(this));
        conn.on("close", this.afterClose.bind(this));
        conn.on("error", this.error.bind(this));
    }

    receive = function(conn) {
        console.log("Connection is established with peerJS ID: " + conn.peer);

        this.connection = conn;
        window.location.hash = conn.peer;

        this.state["partnerLink"] = this.generateLink(conn.peer);
        ConnectRenderer.render(this.state);

        this.openConnCallback();
    }

    afterClose = function() {
        console.log("The connection is closed! Partner peer id was: " + this.connection.peer);

        window.location.hash = '';
        this.connection = undefined;
        delete(this.state["partnerLink"])

        ConnectRenderer.render(this.state);
    }

    send = function(data) {
        this.connection.send(data);
    }

    handleData = function(data) {
        console.log("Data are received!");
        console.log(data);

        this.getDataCallback(data);
    }

    error = function(err) {
        console.log("Connection error:");
        console.log(err);
    }

    generateLink = function(peerID) {
        return window.location.origin + window.location.pathname + "#" + peerID;
    }

    closeConnection = function() {
        if(this.connection) this.connection.close();
    }
}
