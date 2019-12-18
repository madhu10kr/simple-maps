import React from 'react';
import { message, Skeleton , Button, Input, Card, Icon, Switch, Tooltip, Popconfirm, Collapse } from 'antd';
import axios from 'axios';
import MapChart from '../map/MapChart';

const { Panel } = Collapse;

function callback(key) {
    console.log(key);
}

function cancel(e) {
    message.error('Delete Cancelled');
}


class Event extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            place: "",
            mapApiData: [],
            totalList: [],
            showLoader: false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this)
    };


    componentDidMount() {
        this.getData()
    }

    getData = () => {
        axios.get('https://simple-maps.herokuapp.com/api').then(data => {
            this.setState({ totalList: data.data.data })
        }).catch(err => console.log(err))
    }

    handleChange(e) {
        this.setState({ place: e.target.value });
    };

    async handleClick() {
        console.log(this.state.place)
        const value = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${this.state.place}&key=17f2119c1f9f4529a33a90c5112029ed`);

        console.log(value.data.results)
        this.setState({ mapApiData: value.data.results })
    }

    handleSwitchChange = async (val, val2) => {
        this.setState({ showLoader: true })
        if (val) {
            await axios.post('https://simple-maps.herokuapp.com/api', { place: val2.formatted, details: val2 }).then(data => {
                if (data.data.name === "MongoError") {
                    message.warning("Detials already present")
                }
                this.setState({ showLoader: false })
                this.getData();
                message.success('Successfully Saved');
            }).catch(err => console.log(err))
        } else {
            this.setState({ showLoader: false });
            axios.get(`https://simple-maps.herokuapp.com/api/name/${val2.formatted}`).then(data => {
                const task = { _id: data.data.data._id }
                this.handleConfirmDelete(task)
            }).catch(err => console.log(err))
        }
    }

    handleConfirmDelete = (task) => {
        console.log(task);
        axios.delete(`https://simple-maps.herokuapp.com/api/${task._id}`).then(data => {
            console.log(data);
            message.success('Successfully deleted');
            this.getData()
        }).catch(err => message.error('Error, Please try again'))

    }

    render() {
        return (
            <div>
                <div className="container" style={{ marginTop: "4%" }}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="d-flex">
                                <Input onChange={this.handleChange} placeholder='Search the places like "Banglore," "London"' />

                                <Button type="primary" onClick={this.handleClick}>{this.state.showLoader ? <Icon type="loading" /> : "Get Data"}</Button>
                            </div>
                            <br></br><br></br>


                            {this.state.mapApiData.length === 0 ? <Skeleton  /> :
                                <div>
                                    {this.state.mapApiData.map((obj, index) => {
                                        return (
                                            <div key={index}>
                                                <Card title={obj.formatted} extra={
                                                    <Tooltip title="Save Details">
                                                        <Switch
                                                            checkedChildren={<Icon type="check" />}
                                                            unCheckedChildren={<Icon type="close" />}
                                                            defaultChecked={false}
                                                            onChange={(val) => this.handleSwitchChange(val, obj)}

                                                        />
                                                    </Tooltip>
                                                } style={{ width: "100%" }}>

                                                    <MapChart markers={[{
                                                        markerOffset: 15,
                                                        name: obj.formatted,
                                                        coordinates: [obj.geometry.lng
                                                            , obj.geometry.lat]
                                                    }]} />

                                                </Card>
                                                <br></br>
                                            </div>
                                        )
                                    })}
                                </div>
                            }

                        </div>

                        <div className="col-md-6">
                            <Collapse expandIconPosition={"right"} defaultActiveKey={['1']} onChange={callback}>

                                <Panel header="All saved places" key="1">
                                    {this.state.totalList.map((val, i) => {
                                        return (
                                            <div key={i}>
                                                <Card title={val.details.formatted}
                                                    extra={<Popconfirm
                                                        title="Are you sure delete this task?"
                                                        onConfirm={this.handleConfirmDelete.bind(this, val)}
                                                        onCancel={cancel}
                                                        okText="Yes"
                                                        cancelText="No"
                                                    >
                                                        <Icon type="delete" />
                                                    </Popconfirm>}
                                                    style={{ width: "100%" }}>

                                                    <MapChart markers={[{
                                                        markerOffset: 15,
                                                        name: val.details.formatted,
                                                        coordinates: [val.details.geometry.lng
                                                            , val.details.geometry.lat]
                                                    }]} />

                                                </Card>
                                                <br></br>
                                            </div>
                                        )
                                    })}
                                </Panel>
                            </Collapse>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
};

export default Event;