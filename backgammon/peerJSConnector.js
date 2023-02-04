class PeerJSConnector {
    constructor() {
        this.peer = undefined;
        this.connection = undefined;
    }

    openPeer = function(openConnCallback) {
        this.openPeerRenderer = ConnectRenderer.renderOpenPeer.bind(this);
        this.openConnRenderer = ConnectRenderer.renderOpenConnection.bind(this);
        this.closeConnRenderer = ConnectRenderer.renderCloseConnection.bind(this);
        this.openConnCallback = openConnCallback;

        this.peer = new Peer();

        this.peer.on("connection", function(conn) {
            if(this.connection) {
                console.log("Connection attempt will be declined cause of existing connection. Incoming peerJS id: " + conn.peer);
                conn.close();
                return;
            }

            this.handleConnection(conn);

            conn.on('data', this.handleData.bind(this));
            conn.on("close", this.handleCloseConnection.bind(this));
            conn.on("error", this.errorConnection.bind(this));
        }.bind(this));

        this.peer.on("open", function(myPeerId) {
            console.log("PeerJS is opened. The id: " + myPeerId);

            let partnerPeerId = window.location.hash.replace('#', '');
            if(partnerPeerId) this.makeConnection(partnerPeerId);

            this.openPeerRenderer(this.generateLink(myPeerId));
        }.bind(this));
    }

    makeConnection = function(partnerPeerId) {
        if(this.connection) {
            console.log("Connection exists already. Partner peerJS id: " + this.connection.peer);
            return;
        }

        console.log("Try to connect with peerJS ID: " + partnerPeerId);
        let conn = this.peer.connect(partnerPeerId);

        conn.on('open', function() {this.handleConnection(conn);}.bind(this));

        conn.on('data', this.handleData.bind(this));
        conn.on("close", this.handleCloseConnection.bind(this));
        conn.on("error", this.errorConnection.bind(this));
    }


    handleConnection = function(conn) {
        this.connection = conn;
        console.log("Connection is established with peerJS ID: " + conn.peer);
        window.location.hash = conn.peer;

        this.openConnRenderer(this.generateLink(conn.peer));

        this.openConnCallback();
    }

    handleCloseConnection = function() {
        console.log("The connection is closed! Partner peer id was: " + this.connection.peer);
        window.location.hash = '';
        this.connection = undefined;

        this.closeConnRenderer();

    }

    handleData = function(data) {
        console.log("Data are received!");
        console.log(data);
    }

    errorConnection = function(err) {
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
