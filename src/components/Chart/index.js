import React, { PureComponent } from "react";
import ReactEcharts from "echarts-for-react";
import { Component } from "react";

class Chart extends Component{
    constructor(props){
        super(props);
        this.state = {
          x:[],
          y:[]
        }
        console.log(this.props)
        let ydata = []
        let xdata = []
        this.props.data.map((xy)=>{
          ydata.push(xy.Amount)
          xdata.push(xy.Category)
        })
        this.state.x=xdata;
        this.state.y=ydata;
        console.log(this.state.x,this.state.y)
        this.handledata=this.handledata.bind(this)
    }
    handledata(){
      console.log(this.props.data)
      let ydata = []
      let xdata = []
      this.props.data.map((xy)=>{
        ydata.push(xy.Amount)
        xdata.push(xy.Category)
      })
      this.setState({x:xdata,y:ydata});
      console.log(this.state.x,this.state.y)
    }
    componentDidMount(){
      this.handledata()
    }
    render(){
        return (
            <ReactEcharts
              option={{
                backgroundColor: "#fff",
                xAxis: {
                  type: "category",
                  data: this.state.x
                },
                yAxis: {
                  type: "value"
                },
                series: [
                  {
                    data: this.state.y,
                    type: "bar",
                    barWidth: 15,
                    showBackground: false,
                    backgroundStyle: {
                      color: "rgba(220, 220, 220, 0.8)"
                    }
                  }
                ],
                tooltip: {
                  trigger: "axis",
                  confine: true,
                  enterable: true,
                  axisPointer: {
                    type: "shadow",
                    shadowStyle: {
                      color: "rgba(255,0,0, 0.5)"
                    }
                  },
                  backgroundColor: "rgba(255,255,255,1)",
                  textStyle: {
                    color: "#6D6D70"
                  },
                  extraCssText: `box-shadow:  3px 6px 14px #cccccc61;border-radius: 10px;`
                }
              }}
              onEvents={{
                click: (evt) => alert(JSON.stringify(evt.data))
              }}
            />
          );
    }
}

export default Chart;