var React, console;

var ConnectToAPIComponent = React.createClass({
    propTypes: {
        query: React.PropTypes.string.isRequired,
        reload: React.PropTypes.bool.isRequired,
        dataCallback: React.PropTypes.func.isRequired,
        dataErrback: React.PropTypes.func
    },
    loadData: function(e) {
        if(e.target.status == 200) {
            this.props.dataCallback(JSON.parse(e.target.response));
        } else {
            console.error(e.target.response);
            if (typeof this.props.dataErrback === 'function') {
                this.props.dataErrback(e.target.response);
            }
        }
    },
    render: function() {
        if (this.props.reload) {
            var client = new XMLHttpRequest();
            client.onload = this.loadData;
            client.open("GET", this.props.query);
            client.setRequestHeader("Accept", "application/json");
            client.send();
        }
        return null;
    },
});
