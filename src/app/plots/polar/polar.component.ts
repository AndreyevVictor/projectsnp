import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Drag from 'd3-drag';
import * as d3Scale from "d3-scale";
import * as d3Shape from "d3-shape";
import * as d3Array from "d3-array";
import * as d3Axis from "d3-axis";
import { Line } from "../../shared/interfaces/line.interface";
import {  PolarData, LocH, LocU, LeftLimit  } from '../../shared/models/temp/polar.data';
import { ScoringAlgorithmService } from '../../shared/services/scoring.algorithm.service';

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

  constructor(private scoringAlgorithmService: ScoringAlgorithmService) {
    this.width = 900 - this.margin.left - this.margin.right ;
    this.height = 500 - this.margin.top - this.margin.bottom;
  }

  ngOnInit() {
    this.initSvg();
    this.initAxis();
    this.drawAxis();
    this.setBackgrounds();
    this.setGridLines();
    this.drawPoints();
    this.drawLines(LocH, true);
    this.drawLines(LocU, true);
    this.drawLines(LeftLimit, false);
  }

  private initSvg() {
    this.svg = d3.select("svg.polar")
                 .append("g")
                 .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
  }

  private initAxis() {
    this.x = d3Scale.scaleLinear().range([0, this.width]);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    this.x.domain([0, 0.99]);
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
          .text("Text 1")
          .insert("g", ".bars")
          .attr("class", "grid horizontal");
  }

  private drawPoints() {
    this.svg.selectAll(".dot")
      .data(this.scoringAlgorithmService.locusData.values().next().value.PolarData)
      .enter().append("circle")
      .classed("dot", true)
      .attr("r", 2)
      .attr("cx", (d: any) => this.x(d.x))
      .attr("cy", (d: any) => this.y(d.y))
      .style("fill", (d: any) => d.color)
      .style("cursor", "pointer")
      .on("mouseover", (d) => {
          d3.select(".tooltip-polar")
              .style("opacity", .9);
          d3.select(".tooltip-polar").html(d.tooltipData.data + "<br/>"  +
            "Sample: " + d.tooltipData.sample + "<br/>" +
            "#A: " + d.tooltipData.a + "<br/>" +
            "#G: " + d.tooltipData.g)
              .style("left", (d3.event.pageX + 20) + "px")
              .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", (d) => {
          d3.select(".tooltip-polar")
              .style("opacity", 0);
        })
        .on("click", (d) => {
          d3.select(".menu-polar")
              .style("opacity", .9)
              .style("left", (d3.event.pageX - 10) + "px")
              .style("top", (d3.event.pageY + 20) + "px");
        });

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
              line.attr("y1",isHoryzontalBorder(y1New))
                .attr("y2",isHoryzontalBorder(y2New))
             } else {
                line.attr("x1",isVerticalBorder(x1New))
                  .attr("x2",isVerticalBorder(x2New))
             }
             resizeBackgrounds();
          });
      var isVerticalBorder = (value:number):number => {
        if (value < 0) {
          return 0;
        } else if (value > this.x(LocU.end.x)) {
          return this.x(LocU.end.x);
        } else {
          return value;
        }
      }
      var isHoryzontalBorder = (value:number):number => {
        if (value < 0) {
          return 0;
        } else if (value > this.y(LeftLimit.start.y)) {
          return this.y(LeftLimit.start.y);
        } else {
          return value;
        }
      }
      var changeLinesPosition = (redSize:number, blueSize:number, graySize:number):void => {
        //change line position
        d3.select('.line-red').attr('x1', graySize);
        d3.select('.line-blue').attr('x1', graySize);

        //change blue line position when red is lower
        if (redSize >= blueSize) {
          d3.select('.line-blue').attr('y1', redSize)
                  .attr('y2', redSize);
        }

        //change red line position when blue is upper
        if (blueSize <= redSize) {
          d3.select('.line-red').attr('y1',blueSize)
                  .attr('y2', blueSize);
        }

        //change visible lines position
        d3.select('.line-red-border').attr('x1', graySize)
                                    .attr('y1', redSize)
                                    .attr('y2', redSize);
        d3.select('.line-blue-border').attr('x1', graySize)
                                    .attr('y1', blueSize)
                                    .attr('y2', blueSize);
        d3.select('.line-gray-border').attr('x1', graySize)
                                    .attr('x2', graySize);

        //redraw points color
        d3.selectAll(".dot")
          .each((d:any) => {
            if (this.y(d.y) <= redSize && this.x(d.x) >= graySize) {
              d.color = "red";
            } else if (this.y(d.y) >= blueSize && this.x(d.x) >= graySize) {
              d.color = "blue";
            } else if (this.x(d.x) <= graySize) {
              d.color = "gray";
            } else {
              d.color = "green";
            }
          })
          .style("fill", (d: any) => d.color);

      }
      var resizeBackgrounds = ():void => {
          var redSize: number = parseFloat(d3.select('.line-red').attr('y1'));
          var blueSize: number = parseFloat(d3.select('.line-blue').attr('y1'));
          var graySize: number = parseFloat(d3.select('.line-gray').attr('x1'));
          //change rectangles size
          d3.select('.rect-red').attr('y2', redSize)
                    .attr('x', graySize)
                    .attr('height', redSize)
                    .attr('width', this.x(LocU.end.x) - graySize);

          d3.select('.rect-blue').attr('y', blueSize)
                    .attr('x', graySize)
                    .attr('height', (this.y(LeftLimit.start.y) - blueSize))
                    .attr('width', this.x(LocU.end.x) - graySize);

          d3.select('.rect-gray').attr('x', graySize)
                    .attr('width', (this.x(LocU.end.x) - graySize));

          changeLinesPosition(redSize, blueSize, graySize);
      }

    //visible lines
    this.svg.append("line")
                  .attr("x1",  this.x(data.start.x))
                  .attr("y1", this.y(data.start.y))
                  .attr("x2",  this.x(data.end.x))
                  .attr("y2", this.y(data.end.y))
                  .attr('stroke-width', 1)
                  .attr('stroke', data.color)
                  .attr('class', 'line-' + data.color + '-border');

    //lines for drag
    let line = this.svg.append("line")
                   .attr("x1",  this.x(data.start.x))
                   .attr("y1", this.y(data.start.y))
                   .attr("x2",  this.x(data.end.x))
                   .attr("y2", this.y(data.end.y))
                   .attr('stroke-width', 10)
                   .attr('stroke', 'transparent')
                   .attr('class', 'line-' + data.color)
                   .call(drag);
    d3.select('.line-red').style("cursor", "row-resize");
    d3.select('.line-blue').style("cursor", "row-resize");
    d3.select('.line-gray').style("cursor", "col-resize");
   }

   private setBackgrounds(){
     this.svg.append("rect")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("width", this.x(LocH.end.x))
                    .attr("height", this.y(LeftLimit.start.y))
                    .attr('class', 'rect-main')
                    .attr('fill-opacity', 0.7)
                    .style('fill', '#f4f4f4')
                    .on("click", (d) => {
                      d3.select(".menu-polar")
                          .style("opacity", 0);
                    });

     this.svg.append("rect")
                    .attr("x", this.x(LeftLimit.start.x))
                    .attr("y", 0)
                    .attr("width", this.x(LocH.end.x - LeftLimit.start.x))
                    .attr("height", this.y(LeftLimit.start.y))
                    .attr('class', 'rect-gray')
                    .attr('fill-opacity', 0.7)
                    .style('fill', '#d1ecd1')
                    .on("click", (d) => {
                      d3.select(".menu-polar")
                          .style("opacity", 0);
                    });
    this.svg.append("rect")
                    .attr("x", this.x(LeftLimit.start.x))
                    .attr("y1", this.y(LeftLimit.end.y))
                    .attr("y2", this.y(LeftLimit.start.y))
                    .attr("width", this.x(LocH.end.x - LeftLimit.start.x))
                    .attr("height", this.y(LocH.start.y))
                    .attr('class', 'rect-red')
                    .attr('fill-opacity', 0.7)
                    .style('fill', '#f1e2e2')
                    .on("click", (d) => {
                       d3.select(".menu-polar")
                                .style("opacity", 0);
                    });

     this.svg.append("rect")
                    .attr("x", this.x(LeftLimit.start.x))
                    .attr("y", this.y(LocU.start.y))
                    .attr("width", this.x(LocH.end.x - LeftLimit.start.x))
                    .attr("height", this.y(LeftLimit.end.y-LocU.start.y))
                    .attr('class', 'rect-blue')
                    .attr('fill-opacity', 0.7)
                    .style('fill', '#c7c7ef')
                    .on("click", (d) => {
                      d3.select(".menu-polar")
                          .style("opacity", 0);
                    });

   }
   private setGridLines(){
     this.svg.selectAll("line.horizontalGrid")
                   .data(this.y.ticks(6))
                   .enter()
                   .append("line")
                   .attr("class", "horizontalGrid")
                   .attr("x1", 0)
                   .attr("x2", this.width)
                   .attr("y1", this.y)
                   .attr("y2", this.y)
                   .style('fill', '#f1e2e2')
                   .attr('stroke-width', 1)
                   .attr("stroke", "black")
                   .style("stroke-dasharray", "0.5 3")
                   .attr("shape-rendering", "geometricPrecision");

    this.svg.selectAll("line.verticalGrid")
                  .data(this.x.ticks(8))
                  .enter()
                  .append("line")
                  .attr("class", "verticalGrid")
                  .attr("x1", this.x)
                  .attr("x2", this.x)
                  .attr("y1", 0)
                  .attr("y2", this.height)
                  .style('fill', '#f1e2e2')
                  .attr('stroke-width', 1)
                  .style("stroke-dasharray", "0.5 3")
                  .attr("stroke", "black")
                  .attr("shape-rendering", "geometricPrecision");
   }

}
