import React, {
    Component
} from 'react';

//React Router
import { Switch, Route } from 'react-router-dom';

//Third Party Components
import { Grid, Row, Col } from 'react-bootstrap';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

//Custom Components
import UsersPage from './users/UsersPage';
import QuizzesPage from './quizzes/QuizzesPage';
import GroupsPage from './groups/GroupsPage';
import SideNavbarWarpper from './common/SideNavbarWarpper';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openNavbar: false,
            width: window.innerWidth,
        };
    }

    handleNavbarToggle = () => this.setState({openNavbar: !this.state.openNavbar});

    componentDidMount = () => {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount = () => {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions = () => {
        this.setState({ width: window.innerWidth });
    }

    render() {
        return (
            <MuiThemeProvider>
                <Grid className="main-container" fluid={true}>
                    <Row>
                        <Col className="side-navbar" xs={2}>
                            <SideNavbarWarpper docked={this.state.width < 992 ? false : true} openNavbar={this.state.openNavbar} handleNavbarToggle={this.handleNavbarToggle}/>
                        </Col>
                        <Col className="router-outlet" xs={12} md={10}>
                            <Row>
                                <Col xs={12}>
                                    <AppBar
                                        title={this.state.width < 992 ? "Learner's Quiz App" : null}
                                        showMenuIconButton={this.state.width < 992}
                                        iconElementLeft={
                                            <IconButton onTouchTap={this.handleNavbarToggle}>
                                                <FontIcon className='fa fa-bars' /> 
                                            </IconButton>
                                        }
                                    />                                
                                </Col>
                            </Row>
                            <Row className="router-outlet-content">
                                <Col xs={12}>
                                    {/*Router Outlet/Container for Active Route*/}
                                    <Switch>
                                        <Route exact path='/users' component={UsersPage}/>
                                        <Route path='/quizzes' component={QuizzesPage}/>
                                        <Route path='/groups' component={GroupsPage}/>
                                    </Switch>                                
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Grid>                
            </MuiThemeProvider>
        );
    };
}