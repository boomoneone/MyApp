import React from 'react'
import {Router, Scene, Stack, ActionConst} from 'react-native-router-flux'

import Home from './home'
import Edit from './edit'
import Add from './add'

const Routes = () => (
    <Router>
        <Stack key='root' titleStyle={{ alignSelf: 'center' }} hideNavBar={true} type={ActionConst.RESET} >
            <Scene key='home' component={Home} initial hideNavBar={true} type={ActionConst.RESET} />
            <Scene key='edit' component={Edit} hideNavBar={true} />
            <Scene key='add' component={Add} hideNavBar={true} />
        </Stack>
    </Router>
)
export default Routes