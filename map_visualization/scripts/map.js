function createMap() {


    d3.xml("resources/bangladeshHigh.svg")
        .mimeType("image/svg+xml")
        .get(function(error, xml) {
            
            // Error function
            if (error) 
                throw error;
        
                
            // Create container width
            d3.select("#bgdMap")
                .attr("width", 600)
                .attr("height", 600)
                .node()
                .appendChild(xml.documentElement);
            
            // Create zooming function
            const zoom = d3.zoom()
                .on('zoom', () => {
                    d3.select("#bgdMap").style('stroke-width', `${20 / d3.event.transform.k}px`)
                    d3.select("#bgdMap").attr('transform', d3.event.transform) // updated for d3 v4
                })

            // Add zooming functionality to map
            d3.select("#bgdMap")
                .call(zoom);


            // Add points onto map
            var data = {

                "points": [
                    {
                        "hospital": "Chittagong Medical COllege Hospital",
                        "coor": [360, 430]
                    },
                    {
                        "hospital": "Dhaka Medical College Hospital",
                        "coor": [225, 350]
                    },
                    {
                        "hospital": "Uttara Adhunik Medical College Hospital",
                        "coor": [225, 340]
                    },
                    {
                        "hospital": "Khulna Medical College Hospital",
                        "coor": [135, 390]
                    }
                ]    
            }
        
        
            d3.select("#bgdMap")
                .selectAll("dot")
                .data(data.points)
                .enter()
                .append("circle")
                .attr("cx", (d) => {return d.coor[0]})
                .attr("cy", (d) => {return d.coor[1]})
                .attr("r", "4")
                .style("color", "blue")
                .on("mouseover", handleMouseOver)
                .on("mouseout", handleMouseOut);
        
            
            
        });
}

function handleMouseOver(d, i) {  // Add interactivity


    // Use D3 to select element, change color and size
    d3.select(this)
        .transition()
        .duration(150)
        .attr("fill", "orange")
        .attr("r", 4 * 2)

    // Specify where to put label of text
    d3.select("#bgdMap")
        .append("text")
        .attr("x", d.coor[0] - 30)
        .attr("y", d.coor[1] - 15)
        .text(d.hospital);
  }

  function handleMouseOut(d, i) {
    // Use D3 to select element, change color back to normal
    d3.select(this)
        .transition()
        .duration(300)
        .attr("fill", "black")
        .attr("r", 4)
        

    d3.select("text")
        .remove()
    
    }