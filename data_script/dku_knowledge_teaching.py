import pandas as pd
import json
from datetime import datetime

ori_name = 'Area'
ori_2_area = {}
area_2_interest = {}
interest_2_faculty = {}
faculty_2_website = {}

#读取excel文件
df = pd.read_excel('dku_knowledge_230504.xlsx')

ParentPrimaryMajorSupportSet = set()
faculty_set = set()
major_set = set()
faculty_2_properties = {}
major_2_parent = {}
faculty_2_major = {}
research_pillar_primary_list = df['research_pillar_primary']
for index in range(0, research_pillar_primary_list.size):
    ParentPrimaryMajorSupportSet.add(df['parent_major_support_primary'][index])
    faculty_2_properties[df['name'][index]] = {
        "major_support_primary": df['major_support_primary'][index],
        "website_link": "" if pd.isnull(df['website_link'][index]) else df['website_link'][index],
        "research_interest": df['research_interest'][index].rstrip("; ").split(";"),
        "parent_major_support_primary": df['parent_major_support_primary'][index],
        "research_discipline_secondary": "" if pd.isnull(df['research_discipline_secondary'][index]) else df['research_discipline_secondary'][index],
        "research_direction": df['research_direction'][index],
        "research_pillar_primary": df['research_pillar_primary'][index],
        "research_pillar_secondary": "" if pd.isnull(df['research_pillar_secondary'][index]) else df['research_pillar_secondary'][index],
        "major_support_secondary": "" if pd.isnull(df['major_support_secondary'][index]) else df['major_support_secondary'][index],
        "title": df['title'][index],
        "division": "Natural and Applied Sciences",
        "affiliation": "Duke Kunshan University",
        "name": df['name'][index],
        "research_discipline_primary": df['research_discipline_primary'][index],
        "email": df['email'][index],
        "course_taught": df['Course Taught'][index].rstrip("; ").split(";")
    }
    faculty_set.add(df['name'][index])
    major_set.add(df['major_support_primary'][index])
    major_2_parent[df['major_support_primary'][index]] = df['parent_major_support_primary'][index]
    faculty_2_major[df['name'][index]] = df['major_support_primary'][index]

nodes_list = []
node_id = 0
faculty_2_id = {}
parent_2_id = {}
major_2_id = {}
nodes_list.append({"labels": [
                "Center_MajorSupport"
                ],
                "properties": {
                    "name": "Center Node"
                },
                "elementId": str(node_id),
                "id": node_id})
node_id += 1

for parent in ParentPrimaryMajorSupportSet:
    nodes_list.append({"labels": [
                        "ParentPrimaryMajorSupport"
                        ],
                    "properties": {
                        "name": parent,
                    },
                    "elementId": str(node_id),
                    "id": node_id})
    parent_2_id[parent] = node_id
    node_id += 1

for major in major_set:
    nodes_list.append({
            "labels": [
                "PrimaryMajorSupport"
            ],
            "properties": {
                "name": major,
                "parent": major_2_parent[major]
            },
            "elementId": str(node_id),
            "id": node_id
        })
    major_2_id[major] = node_id
    node_id += 1

for faculty in faculty_set:
    nodes_list.append({"labels": ["Faculty_notshown"], "id": node_id, "elementId": str(node_id),
                       "properties": faculty_2_properties[faculty]})
    faculty_2_id[faculty] = node_id
    node_id += 1

#print(nodes_list)
link_id = 0
links_list = []
for parent in ParentPrimaryMajorSupportSet:
    links_list.append({
            "type": "parent_primary_major_center_to",
            "properties": {},
            "elementId": str(link_id),
            "startNodeElementId": str(parent_2_id[parent]),
            "endNodeElementId": "0",
            "id": link_id,
            "source": parent_2_id[parent],
            "target": 0,
            "value": 2
        })
    link_id += 1

for major in major_set:
    links_list.append({
            "type": "has_parent_primary_major",
            "properties": {},
            "elementId": str(link_id),
            "startNodeElementId": str(major_2_id[major]),
            "endNodeElementId": str(parent_2_id[major_2_parent[major]]),
            "id": link_id,
            "source": major_2_id[major],
            "target": parent_2_id[major_2_parent[major]],
            "value": 2
        })
    link_id += 1

for faculty in faculty_set:
    links_list.append({
            "type": "support_major_primary",
            "properties": {},
            "elementId": str(link_id),
            "startNodeElementId": str(faculty_2_id[faculty]),
            "endNodeElementId": str(major_2_id[faculty_2_major[faculty]]),
            "id": link_id,
            "source": faculty_2_id[faculty],
            "target": major_2_id[faculty_2_major[faculty]],
            "value": 2
        })
    link_id += 1

whole_data = {"nodes": nodes_list, "links": links_list}
result = json.dumps(whole_data, indent = 2)
# Writing to sample.json
with open("teaching.js", "w") as outfile:
    outfile.write("var graph_teaching = %s" % result)