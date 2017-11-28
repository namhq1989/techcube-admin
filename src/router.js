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
import { CustomersView, CustomersModel } from './screens/customers'
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
