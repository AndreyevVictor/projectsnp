import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Drag from 'd3-drag';
import * as d3Scale from "d3-scale";
import * as d3Shape from "d3-shape";
import * as d3Array from "d3-array";
import * as d3Axis from "d3-axis";
import * as d3Path from "d3-path";
import { LocU, Rectangle, lineData} from '../../shared/models/temp/density.data';
import { ScoringAlgorithmService } from '../../shared/services/scoring.algorithm.service';
import { Density } from "../../shared/models/density.model";

@Component({
  selector: 'app-density',
  templateUrl: './density.component.html',
  styleUrls: ['./density.component.scss']
})

export class DensityComponent implements OnInit {

  private margin = {top: 20, right: 20, bottom: 30, left: 50};
  private width: number;
  private height: number;
  private x: any;
  private y: any;
  private svg: any;
  private model: Density[];

  constructor(private scoringAlgorithmService: ScoringAlgorithmService) {
    this.width = 900 - this.margin.left - this.margin.right ;
    this.height = 500 - this.margin.top - this.margin.bottom;
    this.model = this.scoringAlgorithmService.locusData.values().next().value.DensityData;
  }

  ngOnInit() {
    this.initSvg();
    this.initAxis();
    this.drawAxis();
    this.setGridLines();
    this.setBackgrounds();
    this.drawPoints();
    this.drawLines();
    this.drawGraphs();
  }

  private initSvg() {
    this.svg = d3.select("svg.density")
                 .append("g")
                 .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
  }

  private initAxis() {
    this.x = d3Scale.scaleLinear().range([0, this.width]);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    //this.x.domain([0, 850]);
    //this.y.domain([0, 850]);
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
      .data(this.model)
      .enter().append("circle")
      .classed("dot", true)
      .attr("r", 2)
      .attr("cx", (d: any) => this.x(d.x))
      .attr("cy", (d: any) => this.y(d.y))
      .style("fill", (d: any) => d.color)
      .style("cursor", "pointer")
      .on("mouseover", (d) => {
          d3.select(".tooltip-density")
              .style("opacity", .9);
          d3.select(".tooltip-density").html(d.tooltipData.data + "<br/>"  +
            "Sample: " + d.tooltipData.sample + "<br/>" +
            "#A: " + d.tooltipData.a + "<br/>" +
            "#G: " + d.tooltipData.g)
              .style("left", (d3.event.pageX + 20) + "px")
              .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", (d) => {
          d3.select(".tooltip-density")
              .style("opacity", 0);
        })
        .on("click", (d) => {
          d3.select(".menu-density")
              .style("opacity", .9)
              .style("left", (d3.event.pageX - 10) + "px")
              .style("top", (d3.event.pageY + 20) + "px");
        });

  }

  private drawLines() {
    let line = this.svg.selectAll(".line")
                    .data(LocU)
                    .enter().append("line")
                    .attr("x1",  (data: any) => this.x(data.start.x))
                    .attr("y1", (data: any) => this.y(data.start.y))
                    .attr("x2",  (data: any) => this.x(data.end.x))
                    .attr("y2", (data: any) => this.y(data.end.y))
                    .attr('stroke-width', 1)
                    .attr('stroke', (data: any) => data.color)
                    .attr('class', 'line-' + ((data: any) => data.color))
                    .style("stroke-dasharray", "4,4")
   }

   private drawGraphs() {
      var lineFunction = d3Shape.line()
              .x((d) => {return d[0];})
              .y((d) => {return d[1];})
            .curve(d3Shape.curveBasis);
      lineData.forEach( (i) => {
        var lineGraph = this.svg.append("path")
            .attr("d", lineFunction(i.data))
            .attr("stroke", i.color)
            .attr("stroke-width", i.width)
            .attr("fill", "none");
      });
   }

   private setBackgrounds(){
     this.svg.append("rect")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("width", Rectangle.width)
                    .attr("height", Rectangle.height)
                    .attr('class', 'rect-main')
                    .attr('fill-opacity', 0.7)
                    .style('fill', '#f4f4f4')
                    .on("click", (d) => {
                      d3.select(".menu-density")
                          .style("opacity", 0);
                    });
   }

   private setGridLines(){
     this.svg.selectAll("line.horizontalGrid")
                   .data(this.y.ticks(8))
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
