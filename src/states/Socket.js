export default class SocketState extends Phaser.State
{

    socketOn(socketString, method)
    {
        this.socket.on(socketString, method.bind(this));
    }

    socketEmit(socketString, data)
    {
        this.socket.emit(socketString, data);
    }

    socketConnect(url)
    {
        let location =  window.location.protocol;

        if (!url)
        {
            if (location)
            {
                let url = location.protocol + '//' + location.hostname + ':' + location.port;
            }
        }

        this.socket = io.connect(url);
    }

}
