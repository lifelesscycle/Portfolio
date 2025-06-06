import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import './Skills.css';

const Skills = () => {
  const sectionData = {
    technical: {
      name: "Technical Skills",
      graphs: [
        {
          title: "Python & ML Libraries",
          data: [
            { name: 'Proficient', value: 92, color: '#3776AB' },
            { name: 'Learning', value: 8, color: '#E8E8E8' }
          ]
        },
        {
          title: "Deep Learning Frameworks",
          data: [
            { name: 'Expert', value: 85, color: '#FF6F00' },
            { name: 'Improving', value: 15, color: '#E8E8E8' }
          ]
        }
      ]
    },
    specialization: {
      name: "AI/ML Specializations",
      graphs: [
        {
          title: "Computer Vision",
          data: [
            { name: 'Advanced', value: 88, color: '#4CAF50' },
            { name: 'Developing', value: 12, color: '#E8E8E8' }
          ]
        },
        {
          title: "Natural Language Processing",
          data: [
            { name: 'Proficient', value: 78, color: '#9C27B0' },
            { name: 'Expanding', value: 22, color: '#E8E8E8' }
          ]
        }
      ]
    },
    tools: {
      name: "Tools & Platforms",
      graphs: [
        {
          title: "Cloud & MLOps",
          data: [
            { name: 'Experienced', value: 82, color: '#FF5722' },
            { name: 'Learning', value: 18, color: '#E8E8E8' }
          ]
        },
        {
          title: "Data Engineering",
          data: [
            { name: 'Skilled', value: 75, color: '#00BCD4' },
            { name: 'Growing', value: 25, color: '#E8E8E8' }
          ]
        }
      ]
    }
  };

  const RingGraph = ({ data, title }) => {
    const mainValue = data[0].value;
    
    return (
      <div className="ring-graph">
        <div className="graph-container">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                startAngle={90}
                endAngle={450}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="center-value">
            <span className="percentage">{mainValue}%</span>
            <span className="skill-level">{data[0].name}</span>
          </div>
        </div>
        <div className="graph-caption">
          <h4>{title}</h4>
          <div className="legend">
            {data.map((item, index) => (
              <div key={index} className="legend-item">
                <div 
                  className="legend-color" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="graph-sections-container">
      {Object.entries(sectionData).map(([key, section], sectionIndex) => (
        <div key={key}>
          <div className="section">
            <h2 className="section-title">{section.name}</h2>
            <div className="graphs-row">
              {section.graphs.map((graph, graphIndex) => (
                <RingGraph
                  key={graphIndex}
                  data={graph.data}
                  title={graph.title}
                />
              ))}
            </div>
          </div>
          {sectionIndex < Object.keys(sectionData).length - 1 && (
            <div className="section-divider"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Skills;