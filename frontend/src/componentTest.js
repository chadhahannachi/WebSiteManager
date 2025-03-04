import React, { useState } from "react";
import GridLayout from "react-grid-layout";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { Card, CardContent, Typography } from "@mui/material";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

function BlogPostOne() {
  const [layout, setLayout] = useState([
    { i: "title", x: 0, y: 0, w: 12, h: 2, static: false },
    { i: "card1", x: 0, y: 2, w: 4, h: 4 },
    { i: "card2", x: 4, y: 2, w: 4, h: 4 },
    { i: "card3", x: 8, y: 2, w: 4, h: 4 },
    { i: "card4", x: 0, y: 6, w: 6, h: 4 },
    { i: "card5", x: 6, y: 6, w: 6, h: 4 },
  ]);

  const onLayoutChange = (newLayout) => {
    setLayout(newLayout);
  };

  return (
    <Box component="section" py={2}>
      <Container>
        <GridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={30}
          width={1200}
          onLayoutChange={onLayoutChange}
          draggableHandle=".drag-handle"
        >
          {/* Title Section */}
          <div key="title">
            <Box py={2} px={6} textAlign="center" className="drag-handle">
              <Typography variant="h2" mt={2} mb={1}>
                Check out what&apos;s new
              </Typography>
              <Typography variant="body2" color="text">
                We get insulted by others, lose trust for those others. We get back freezes every
                winter
              </Typography>
            </Box>
          </div>

          {/* Cards */}
          <div key="card1">
            <ColoredBackgroundCard
              image="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/soft-ui-design-system/assets/img/beach.jpg"
              title="Nature's Light"
              description="It really matters and then like it really doesn’t matter. What matters is the people who are sparked by it."
            />
          </div>
          <div key="card2">
            <InfoBackgroundCard
              image="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/soft-ui-design-system/assets/img/indian.jpg"
              icon="import_contacts"
              title="Cultural"
              label="257 spots"
            />
          </div>
          <div key="card3">
            <InfoBackgroundCard
              image="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/soft-ui-design-system/assets/img/city.jpg"
              icon="festival"
              title="Modern Life"
              label="117 spots"
            />
          </div>
          <div key="card4">
            <InfoBackgroundCard
              image="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/soft-ui-design-system/assets/img/greece.jpg"
              icon="volunteer_activism"
              title="Popularity"
              label="363 spots"
            />
          </div>
          <div key="card5">
            <InfoBackgroundCard
              image="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/soft-ui-design-system/assets/img/laught.jpg"
              icon="theater_comedy"
              title="Good Vibes"
              label="215 spots"
            />
          </div>
        </GridLayout>
      </Container>
    </Box>
  );
}

function InfoBackgroundCard({ image, icon, title, label }) {
  return (
    <Card className="drag-handle">
      <img src={image} alt={title} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
      <CardContent>
        <Typography variant="h5">{title}</Typography>
        <Typography variant="body2">{label}</Typography>
      </CardContent>
    </Card>
  );
}

function ColoredBackgroundCard({ image, title, description }) {
  return (
    <Card className="drag-handle">
      <img src={image} alt={title} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
      <CardContent>
        <Typography variant="h5">{title}</Typography>
        <Typography variant="body2">{description}</Typography>
      </CardContent>
    </Card>
  );
}

export default BlogPostOne;
