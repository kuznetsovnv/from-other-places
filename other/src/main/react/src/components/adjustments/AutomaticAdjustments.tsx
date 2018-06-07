import {action, observable} from "mobx";
import * as React from 'react'
import {observer} from 'mobx-react'
import {TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap'
import * as classnames from 'classnames'

import {SpaceAdjustments} from './SpaceAdjustments'
import {AutomaticAdjustmentsTemplate} from './AutomaticAdjustmentsTemplate'


const adjTypes = [
    {
        title: 'Этаж',
        adjustmentsType: 'floorAdjustments',
    },
    {
        title: 'Материал стен',
        adjustmentsType: 'wallsAdjustments',
    },
    {
        title: 'Вид из окна',
        adjustmentsType: 'windowViewAdjustments',
    },
    {
        title: 'Летние помещения',
        adjustmentsType: 'balconyAdjustments',
    },
    {
        title: 'Сан. узел',
        adjustmentsType: 'wcTypeAdjustments',
    },
    {
        title: 'Условия сделки',
        adjustmentsType: 'legalAdjustments',
    },
]

@observer
class AutomaticAdjustments extends React.Component {
    @observable activeTab = 1
    @action toggle = e => {
        if (this.activeTab !== e) this.activeTab = e
    }


    render () {
        return (
            <div>
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={classnames({active: this.activeTab === 1})}
                            onClick={() => {
                                this.toggle(1)
                            }}
                        >
                            Площадь
                        </NavLink>
                    </NavItem>
                    {adjTypes.map((type, index) =>
                        <NavItem key={index+2}>
                            <NavLink
                                className={classnames({active: this.activeTab === index+2})}
                                onClick={() => {
                                    this.toggle(index+2)
                                }}
                            >
                                {type.title}
                            </NavLink>
                        </NavItem>
                    )}
                </Nav>
                <TabContent activeTab={this.activeTab}>
                    <TabPane tabId={1}>
                        <SpaceAdjustments/>
                    </TabPane>
                    {adjTypes.map((type, index) =>
                        <TabPane tabId={index+2} key={index+2}>
                            <AutomaticAdjustmentsTemplate
                                title={type.title}
                                adjustmentsType={type.adjustmentsType}
                            />
                        </TabPane>
                    )}
                </TabContent>
            </div>
        )
    }
}

export {AutomaticAdjustments}
