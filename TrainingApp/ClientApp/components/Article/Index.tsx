import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as models from '../models/article';
import * as Modal from 'react-modal';
import { CreateEdit } from './CreateEdit';
import { Details } from './Details';
import { AddCategoryToArticle } from './AddCategoryToArticle';

import * as category from '../models/category';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

const customStyles = {
    content: {
        top: '30%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        //background: '#fff',
        transform: 'translate(-50%, -50%)',
         minHeight: '530px',
        minWidth: '340px',
        maxWidth: '340px'
    }
};

interface ArticleState {
    article: models.Article[],
    articleId: number;
    category: category.Category[];
    loading: boolean,
    showCreate: boolean,
    showDetails: boolean,
    showEdit: boolean,
    showAddCategory: boolean,
    activeId: number
}

let rowSelected = [];

export class Article extends React.Component<RouteComponentProps<{}>, ArticleState> {
    constructor(props) {
        super(props);
        this.state = {
            article: [],
            articleId: null,
            category: [],
            loading: true,
            showCreate: false,
            showDetails: false,
            showEdit: false,
            showAddCategory: false,
            activeId: 0
        };
        fetch('api/Articles')
            .then(response => response.json() as Promise<models.Article[]>)
            .then(data => {
                this.setState({ article: data, loading: false });
            });
    }

    public render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderTable(this.state.article, true);

        return <div>
                <h1>Articles</h1>
                <div className="text-right">
                    <NavLink to={'/articles/create'} exact className="btn btn-primary">
                        <span className='glyphicon glyphicon-plus'></span>&nbsp;Add Categoy
                    </NavLink>
                </div>        
            {contents}
        </div>;
    }

    private renderTable(article: models.Article[], allowSort: boolean = false) {
        return <table className='table'>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>State</th>
                    <th>More</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {article.map(item =>
                    <tr key={item.Id}>
                        <td>{item.Id}</td>
                        <td>{item.Name}</td>
                        <td>{item.Description}</td>
                        <td>{item.Quantity}</td>
                        <td>{item.Price}</td>
                        <td>{item.State}</td>
                        <td>{item.More}</td>
                        <th>
                            <button className='btn btn-xs btn-info' onClick={(id) => this.handleDetails(item.Id)}>
                                <span className='glyphicon glyphicon-info-sign'></span>&nbsp;Details
                            </button>&nbsp;
                            <NavLink to={`/articles/edit/${item.Id}`} exact className="btn btn-xs btn-warning">
                                <span className='glyphicon glyphicon-pencil'></span>&nbsp;Edit
                            </NavLink>&nbsp;
                            <button className='btn btn-xs btn-danger' onClick={(id) => this.handleDelete(item.Id)}>
                                <span className='glyphicon glyphicon-trash'></span>&nbsp;Delete
                            </button>
                        </th>
                    </tr>
                )}
            </tbody>
        </table>;
    }

    handleDetails(id: number) {
        fetch('api/Categories/GetCategoryByArticleId/' + id, { method: 'GetCategoryByArticleId' })
            .then(response => response.json() as Promise<category.Category[]>)
            .then(data => {
                this.setState({ articleId: id, category: data, loading: false, activeId: id });
            });
    }

    handleDelete(id: number) {
        if (!confirm('Are you sure you want to delete this?'))
            return
        fetch('api/articles/delete/' + id, { method: 'delete' })
            .then(data => {
                this.setState({
                    article: this.state.article.filter((rec) => { return rec.Id != id; })
                });
            });
    }
}