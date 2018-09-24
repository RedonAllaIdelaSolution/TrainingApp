import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { NavLink } from 'react-router-dom';
import { Article } from '../models/article';

interface CreateState {
    article: Article;
    isValid: boolean;
    classDanger: string;
    articleName: string;
}

export class Create extends React.Component<RouteComponentProps<{}>, CreateState> {
    constructor(props) {
        super(props);
        this.state = {
            classDanger: null,
            isValid: false,
            articleName: null,
            article: null
        }
    }

    public render() {
        return <div>

            <h1>Article</h1>
            <p><NavLink to={'/articles'} exact><b>Article</b>
            </NavLink> / Create</p>

            <form className='form-horizontal' id='formCreate'>
                <div className='row'>
                    <div className={ "col-xs-6 col-sm-6 col-md-6 col-lg-6 form-group has-feedback " + this.state.classDanger }>
                        <label className='col-sm-3 control-label'>Name:</label>
                        <div className="col-sm-9">
                            <input type="text"
                                className={"form-control " + this.state.classDanger}
                                id='Name' name='Name'
                                defaultValue={this.state.articleName}
                                onChange={this.handleCategoryNameChange} />
                        </div>
                    </div>
                    <div className="form-group col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <label className='col-sm-3 control-label'>Quantity:</label>
                        <div className="col-sm-9">
                            <input type="number" className="form-control" id="Quantity" name="Quantity" />
                        </div>
                    </div>
                </div>

                <div className='row'>
                    <div className="form-group col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <label className='col-sm-3 control-label'>Description:</label>
                        <div className="col-sm-9">
                            <textarea rows={3} className="form-control" id="Description" name="Description" />
                        </div>
                    </div>
                    <div className="form-group col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <label className='col-sm-3 control-label'>Price:</label>
                        <div className="col-sm-9">
                            <input type="number" className="form-control" id="Price" name="Price" />
                        </div>
                    </div>
                    <div className="form-group col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <label className='col-sm-3 control-label'>State:</label>
                        <div className="col-sm-9">
                            <input type="text" className="form-control" id="State" name="State" />
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className="form-group col-xs-6 col-sm-6 col-md-6 col-lg-6" disabled={true}>
                        <label className='col-sm-3 control-label'>Category:</label>
                        <div className="col-sm-9">
                            <input type="text" className="form-control" id="Category" name="Category" />
                        </div>
                    </div>
                    <div className="form-group col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <label className='col-sm-3 control-label'>More:</label>
                        <div className="col-sm-9">
                            <input type="text" className="form-control" id="More" name="More" />
                        </div>
                    </div>
                </div>
                <div>
                    <NavLink to={'/articles'} exact className="btn btn-default" id='btnCancel'>
                        <span className='glyphicon glyphicon-ban-circle'></span>&nbsp;Cancel
                    </NavLink>
                        &nbsp;&nbsp;
                    <button className="btn btn-success"
                            onClick={this.handleSave.bind(this)}
                            disabled={!this.state.isValid}>
                            <span className='glyphicon glyphicon-floppy-saved'></span>&nbsp;Save
                    </button>
                </div>
            </form>
        </div>;
    }

    handleCategoryNameChange = (e) => {
        if (e.target.value.length === 0) {
            this.setState({ isValid: false, classDanger: 'has-error' });
        }
        else {
            this.setState({ isValid: true, classDanger: null });
        }

        this.setState({ articleName: e.target.value });
    }

    handleSave(e) {
        e.preventDefault()
        let form: Element = document.querySelector('#formCreate')
        let id = document.getElementById('Id') as HTMLInputElement
        console.log(JSON.stringify(this.formToJson(form)));
        fetch('api/Articles/Post',
            {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.formToJson(form))
            })
            .then(this.handleErrors)
            .then(response => {
                if (response.ok)
                    document.getElementById("btnCancel").click();
            })
            .catch(error => alert(error));
    }

    isValidElement = element => {
        return element.name && element.value;
    };

    isValidValue = element => {
        return (['checkbox', 'radio'].indexOf(element.type) == -1 || element.checked);
    };

    formToJson = elements => [].reduce.call(elements, (data, element) => {
        if (this.isValidElement(element) && this.isValidValue(element)) {
            data[element.name] = element.value;
        }
        console.log("formToJson: " + data);
        return data;
    }, {});

    private handleErrors(response) {
        if (!response.ok) {
            console.log(response.statusText);
            throw Error(response.statusText);
        }
        return response;
    }
}