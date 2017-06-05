import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Drag from 'd3-drag';
import * as d3Scale from "d3-scale";
import * as d3Shape from "d3-shape";
import * as d3Array from "d3-array";
import * as d3Axis from "d3-axis";
import { Line, Plots, LocH, LocU, LeftLimit  } from '../../shared/interfaces/plot.interface' 

@Component({
  selector: 'app-polar',
  templateUrl: './polar.component.html',
  styleUrls: ['./polar.component.scss']
})
export class PolarComponent implements OnInit {

  private margin = {top: 20, right: 20, bottom: 30, left: 50};
  private width: number;
  private height: number;
  private x: any;
  private y: any;
  private svg: any;

  constructor() {
    this.width = 900 - this.margin.left - this.margin.right ;
    this.height = 500 - this.margin.top - this.margin.bottom;
  }

  ngOnInit() {
    this.initSvg()
    this.initAxis();
    this.drawAxis();
    this.setBackgrounds();
    this.drawLines(LocH, true);
    this.drawLines(LocU, true);
    this.drawLines(LeftLimit, false);
    this.drawPoints();
  }

  private initSvg() {
    this.svg = d3.select("svg")
                 .append("g")
                 .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
  }

  private initAxis() {
    this.x = d3Scale.scaleLinear().range([0, this.width]);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    this.x.domain([0, 1]);
    this.y.domain([0, 1.7]);
  }

  private drawAxis() {

    this.svg.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + this.height + ")")
          .call(d3Axis.axisBottom(this.x));

    this.svg.append("g")
          .attr("class", "axis axis--y")
          .call(d3Axis.axisLeft(this.y))
          .append("text")
          .attr("class", "axis-title")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Text 1");
  }

  private drawPoints() {
    this.svg.selectAll(".dot")
      .data(Plots)
      .enter().append("circle")
      .classed("dot", true)
      .attr("r", 5)
      .attr("cx", (d: any) => this.x(d.x)) 
      .attr("cy", (d: any) => this.y(d.y))
      .style("fill", (d: any) => d.color)
  }

  private drawLines(data:Line, isHorizontalLine:boolean) {
    var drag = d3Drag.drag()         
           .on('drag', function(d){
             var dx = d3.event.dx;
             var dy = d3.event.dy;
             var x1New = parseFloat(d3.select(this).attr('x1'))+ dx;
             var y1New = parseFloat(d3.select(this).attr('y1'))+ dy;
             var x2New = parseFloat(d3.select(this).attr('x2'))+ dx;
             var y2New = parseFloat(d3.select(this).attr('y2'))+ dy;
             if(isHorizontalLine) {               
              line.attr("y1",y1New)                 
                .attr("y2",y2New)
             } else {
                line.attr("x1",x1New)                 
                  .attr("x2",x2New)
             }                            
          }); 

    let line = this.svg.append("line")
            .attr("x1",  this.x(data.start.x))
            .attr("y1", this.y(data.start.y))
            .attr("x2",  this.x(data.end.x))
            .attr("y2", this.y(data.end.y))
            .attr('stroke-width', 4)
            .attr('stroke', data.color)
            .call(drag);
    
   }

   private setBackgrounds(){
     this.svg.append("rect")
                    .attr("x", this.x(LeftLimit.start.x))
                    .attr("y", this.y(LeftLimit.end.y))
                    .attr("width", this.x(LocH.end.x - LeftLimit.start.x))
                    .attr("height", this.y(LocH.start.y))
                    .style('fill', '#f1e2e2');

     this.svg.append("rect")
                    .attr("x", this.x(LeftLimit.start.x))
                    .attr("y", this.y(LocH.start.y))
                    .attr("width", this.x(LocH.end.x - LeftLimit.start.x))
                    .attr("height", this.y(LeftLimit.end.y - (LocH.start.y - LocU.start.y)))
                    .style('fill', '#d1ecd1');

     this.svg.append("rect")
                    .attr("x", this.x(LeftLimit.start.x))
                    .attr("y", this.y(LocU.start.y))
                    .attr("width", this.x(LocH.end.x - LeftLimit.start.x))
                    .attr("height", this.y(LeftLimit.end.y-LocU.start.y))
                    .style('fill', '#c7c7ef');
   }

}
