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

research_pillar_primary_list = df['research_pillar_primary']
research_pillar_primary_set = set()
faculty_set = set()
interest_set = set()
faculty_2_properties = {}
faculty_2_interest = {}
faculty_2_pillar = {}
for index in range(0, research_pillar_primary_list.size):
    research_pillar_primary_set.add(research_pillar_primary_list[index])
    faculty_set.add(df['name'][index])
    for i in df['research_interest'][index].rstrip("; ").split(";"):
        interest_set.add(i)
    faculty_2_interest[df['name'][index]] = df['research_interest'][index].rstrip("; ").split(";")
    faculty_2_pillar[df['name'][index]] = research_pillar_primary_list[index]
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

nodes_list = []
node_id = 0
faculty_2_id = {}
interest_2_id = {}
pillar_2_id = {}
for primary in research_pillar_primary_set:
    nodes_list.append({"labels": ["PrimaryResearchPillar"], "id": node_id, "elementId": str(node_id),
                       "properties": {"name": primary}})
    pillar_2_id[primary] = node_id
    node_id += 1

for faculty in faculty_set:
    nodes_list.append({"labels": ["Faculty"], "id": node_id, "elementId": str(node_id),
                       "properties": faculty_2_properties[faculty]})
    faculty_2_id[faculty] = node_id
    node_id += 1
    

for interest in interest_set:
    nodes_list.append({"labels": ["ResearchInterest"], "id": node_id, "elementId": str(node_id),
                       "properties": {"name": interest, "version": datetime.now().strftime("%m/%d/%Y")}})
    interest_2_id[interest] = node_id
    node_id += 1
#print(nodes_list)
#print(interest_2_id)
links_list = []
link_id = 0
for faculty in faculty_set:
    links_list.append({"type": "research_pillar_primary",
            "properties": {},
            "elementId": str(link_id),
            "startNodeElementId": str(faculty_2_id[faculty]),
            "endNodeElementId": str(pillar_2_id[faculty_2_pillar[faculty]]),
            "id": link_id,
            "source": faculty_2_id[faculty],
            "target": pillar_2_id[faculty_2_pillar[faculty]],
            "value": 1})
    link_id += 1
    
    for interest in faculty_2_interest[faculty]:
        #print(interest)
        links_list.append({"type": "has_interest", "properties": {}, "elementId": str(link_id), 
                            "startNodeElementId": str(faculty_2_id[faculty]), "endNodeElementId": str(interest_2_id[interest]),
                            "id": link_id,
                            "source": faculty_2_id[faculty],
                            "target": interest_2_id[interest],
                            "value": 1})
        link_id += 1
    

whole_data = {"nodes": nodes_list, "links": links_list}
result = json.dumps(whole_data, indent = 2)
# Writing to sample.json
with open("research-faculty.js", "w") as outfile:
    outfile.write("var graph_research_faculty = %s" % result)