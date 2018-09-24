//npm install react-select
import * as React from 'react';
import createClass from 'create-react-class';
import PropTypes from 'prop-types';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { RouteComponentProps } from "react-router-dom";
import { DropdownModel } from '../models/DropdownModel';

interface DropdownState {
    //selectedOption: Options[];
    removeSelected: boolean;
    disabled: boolean;
    crazy: boolean;
    stayOpen: boolean;
    selectedOption: DropdownModel[];
    sourceList: DropdownModel[];
    rtl: boolean;
}

class Options { label: string; value: string; }

interface DropdownProps {
    removeSelected: boolean;
    disabled: boolean;
    crazy: boolean;
    stayOpen: boolean;
    rtl: boolean;
    sourceList?: any;
    showAlert?: any;
}

export class Dropdown extends React.Component<DropdownProps, DropdownState>{
    constructor(props) {
        super(props);
        this.state = {
            removeSelected: false,
            disabled: false,
            crazy: false,
            stayOpen: false,
            selectedOption: [],
            sourceList: [],
            rtl: false
        }
    }
    returnValues() {
        return this.state.selectedOption;  
    }
    handleSelectChange(value) {
        //console.log('Selected:', value);
        this.setState({ selectedOption: value });
    }

    public render(){
        const { crazy, disabled, stayOpen, selectedOption } = this.state;
        return (
            <div className="section">
                <Select
                    closeOnSelect={this.props.stayOpen}
                    disabled={this.props.disabled}
                    multi
                    onChange={this.handleSelectChange.bind(this)}
                    options={this.props.sourceList}
                    placeholder=""
                    removeSelected={this.props.removeSelected}
                    rtl={this.props.rtl}
                    simpleValue
                    value={this.state.selectedOption}
                />
            </div>
        );
    }
}