import React from "react";
import "./react-heat-map.css";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
const ReactHeatMap = ({ blogs }) => {
  const data = blogs.reduce((acc, blog) => {
    const date = new Date(blog.createdAt.seconds * 1000)
      .toISOString()
      .split("T")[0]; // Convert to date string (YYYY-MM-DD)

    if (!acc[date]) {
      acc[date] = { date: new Date(date), count: 1 };
    } else {
      acc[date].count += 1;
    }

    return acc;
  }, {});

  const heatmapData = Object.values(data);

  return (
    <div className="wrap">
      <h2 className="head">Blogs Heatmap</h2>
      <CalendarHeatmap
        startDate={new Date("2023-01-01")}
        endDate={new Date("2023-12-31")}
        values={heatmapData}
        classForValue={(value) => {
          if (!value) {
            return "color-empty";
          }
          return `color-github-${value.count}`;
        }}
      />
    </div>
  );
};

export default ReactHeatMap;
