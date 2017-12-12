import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect, routerRedux } from 'dva/router'
import dynamic from 'dva/dynamic'
import viVn from 'antd/lib/locale-provider/vi_VN'
import { LocaleProvider } from 'antd'

// Load views
import { LayoutView } from './screens/layout'
import { HomeView, HomeModel } from './screens/home'
import { ActivitiesView, ActivitiesModel } from './screens/activities'
import { CustomersView, CustomersModel, CustomerNewView } from './screens/customers'
import { CustomerShowView, CustomerShowModel } from './screens/customers/show'
import { EventsView, EventsModel, EventNewView } from './screens/events'
import { EventShowView, EventShowModel } from './screens/events/show'
import { StaffsView, StaffsModel, StaffNewView } from './screens/staffs'
import { AreasView, AreasModel } from './screens/events/areas'
import { PlansView, PlansModel } from './screens/events/plans'
import { LoginView, LoginModel } from './screens/login'

const { ConnectedRouter } = routerRedux

function Routers({ history, app }) {
  const error = dynamic({
    app,
    component: () => import('./screens/error')
  })

  // Routes
  const routes = [{
    path: '/login',
    models: () => [LoginModel],
    component: () => LoginView
  }, {
    path: '/home',
    models: () => [HomeModel],
    component: () => HomeView
  }, {
    path: '/activities',
    models: () => [ActivitiesModel],
    component: () => ActivitiesView
  }, {
    path: '/customers',
    models: () => [CustomersModel],
    component: () => CustomersView
  }, {
    path: '/customers/new',
    models: () => [CustomersModel],
    component: () => CustomerNewView
  }, {
    path: '/customers/:id/edit',
    models: () => [CustomersModel],
    component: () => CustomerNewView
  }, {
    path: '/customers/:id',
    models: () => [CustomerShowModel],
    component: () => CustomerShowView
  }, {
    path: '/events',
    models: () => [EventsModel],
    component: () => EventsView
  }, {
    path: '/events/new',
    models: () => [EventsModel],
    component: () => EventNewView
  }, {
    path: '/events/:id/edit',
    models: () => [EventsModel],
    component: () => EventNewView
  }, {
    path: '/events/:id',
    models: () => [EventShowModel],
    component: () => EventShowView
  }, {
    path: '/staffs',
    models: () => [StaffsModel],
    component: () => StaffsView
  }, {
    path: '/staffs/new',
    models: () => [StaffsModel],
    component: () => StaffNewView
  }, {
    path: '/staffs/:id/edit',
    models: () => [StaffsModel],
    component: () => StaffNewView
  }, {
    path: '/events/:eventId/areas/new',
    models: () => [AreasModel],
    component: () => AreasView
  }, {
    path: '/events/:eventId/areas/:id/edit',
    models: () => [AreasModel],
    component: () => AreasView
  }, {
    path: '/events/:eventId/plans/new',
    models: () => [PlansModel],
    component: () => PlansView
  }, {
    path: '/events/:eventId/plans/:id/edit',
    models: () => [PlansModel],
    component: () => PlansView
  }]

  return (
    <LocaleProvider locale={viVn}>
      <ConnectedRouter history={history}>
        <LayoutView>
          <Switch>
            <Route exact path="/" render={() => (<Redirect to="/home" />)} />
            {
              routes.map(({ path, ...dynamics }, key) => (
                <Route
                  key={key}
                  exact
                  path={path}
                  component={dynamic({
                    app,
                    ...dynamics
                  })}
                />
              ))
            }
            <Route component={error} />
          </Switch>
        </LayoutView>
      </ConnectedRouter>
    </LocaleProvider>
  )
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object
}

export default Routers
