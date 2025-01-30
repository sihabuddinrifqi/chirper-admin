import React, { Component } from "react";
import Trix from "trix";

class TextEditor extends React.Component {
    constructor(props) {
        super(props);
        this.trixInput = React.createRef();
    }

    componentDidMount() {
        if (this.trixInput.current) {
            this.trixInput.current.editor.loadHTML(this.props.initialValue || '');
        }

        // Listen for changes in Trix editor
        this.trixInput.current.addEventListener("trix-change", event => {
            this.props.onChange(event.target.innerHTML);
        });
    }

    render() {
        return (
            <div className="mx-auto mt-4 flex flex-col overflow-auto">
                <trix-editor
                    ref={this.trixInput}
                    class="trix-editor overflow-auto mt-4 h-60 border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                />
            </div>
        );
    }
}

export default TextEditor;
