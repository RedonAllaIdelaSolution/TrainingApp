import * as React from 'react';
import { Category } from '../models/category';

interface CreateEditState {
    category: Category;
    loading: boolean;
    save: boolean;
    categoryName: string;
    isValid: boolean;
    classDanger: string;
}

interface CreateEditProps {
    id: number;
    dbaction: string;
    onSave?: any;
}

export class CreateEdit extends React.Component<CreateEditProps, CreateEditState> {
    constructor(props) {
        super(props);
        if (this.props.dbaction == "edit") {
            this.state = {
                classDanger: null,
                isValid: false,
                categoryName: '',
                category: null,
                loading: true,
                save: false
            }
            fetch('api/Categories/GetById/' + this.props.id, { method: 'get' })
                .then(response => response.json() as Promise<Category>)
                .then(data => {
                    this.setState({ isValid: true, categoryName: data.Name, category: data, loading: false });
                });
        } else
            this.state = { classDanger: null, isValid: false, categoryName: '', category: null, loading: false, save: false }
    }
    handleSave(e) {
        e.preventDefault()
        let meth: string = (this.props.dbaction == "edit" ? "put" : "post")
        let form: Element = document.querySelector('#formCreateEdit')
        let id = document.getElementById('Id') as HTMLInputElement

        fetch('api/Categories/' + meth,
            {
                method: meth,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.formToJson(form))
            })
            .then(this.handleErrors)
            .then(data => {
                this.setState({ save: false });
                this.props.onSave(true, 'actionFromCreateEdit');
            })
            .catch(error => alert(error));
    }

    handleCancel() {
        document.getElementById("btnCloseModal").click();
    }

    public render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderForm(this.state.category);
        return <div>
            <h1>{this.props.dbaction == "edit" ? "Edit Category" : "New Category"}</h1>
            {contents}
        </div>;
    }

    private renderForm(item: Category) {
        if (this.props.dbaction != "edit")
            item = new Category()
        return <form id="formCreateEdit">
            <div className="form-group">
                <label>Id</label>
                <input id='Id' name='Id' type='text' defaultValue={item.Id != null ? (item.Id + '') : ''} readOnly={true} className='form-control' />
            </div>
            <div className={"form-group has-feedback " + this.state.classDanger}>
                <label className='control-label'>Name</label>
                <input id='Name' name='Name' type='text'
                    defaultValue={this.state.categoryName}
                    onChange={this.handleCategoryNameChange}
                    className={"form-control " + this.state.classDanger} />
            </div>
            <div className="text-right">
                <button className='btn btn-default' title='Cancel' onClick={this.handleCancel.bind(this)}>
                    <span className='glyphicon glyphicon-ban-circle'></span>&nbsp;Cancel
                </button>
                &nbsp;&nbsp;
                <button className="btn btn-success"
                    onClick={this.handleSave.bind(this)}
                    disabled={!this.state.isValid}>
                    <span className='glyphicon glyphicon-floppy-saved'></span>&nbsp;Save
                </button>
            </div>
        </form>;
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
        return data;
    }, {});

    private handleErrors(response) {
        if (!response.ok) {
            console.log(response.statusText);
            throw Error(response.statusText);
        }
        return response;
    }

    handleCategoryNameChange = (e) => {
        if (e.target.value.length === 0) {
            this.setState({ isValid: false, classDanger: 'has-error' });
        }
        else {
            this.setState({ isValid: true, classDanger: null });
        }  

        this.setState({ categoryName: e.target.value });
    }
}