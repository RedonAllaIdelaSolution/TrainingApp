import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';

import { Article } from './components/Article';
import { Create } from './components/Article/Create';
import { Edit } from './components/Article/Edit';

import { Category } from './components/Category';

export const routes = <Layout>
    <Route exact path='/' component={ Home } />
    <Route path='/counter' component={ Counter } />
    <Route path='/fetchdata' component={FetchData} />

    <Route exact path='/articles' component={Article} />
    <Route exact path='/articles/create' component={Create} />

    <Route path='/articles/edit/:number' render={() => <Edit id={2} />} />

    <Route exact path='/categories' component={Category} />
</Layout>;