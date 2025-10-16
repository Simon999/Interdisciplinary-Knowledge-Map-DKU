import pandas as pd
import json

ori_name = 'Area'
ori_2_area = {}
area_2_interest = {}
interest_2_faculty = {}
faculty_2_website = {}

#读取excel文件
df = pd.read_excel('dku_knowledge_info.xlsx')

#print(df.columns)

# values = df['id'].values
# print(values[2])
final_dict = {}
final_dict["name"] = ori_name
final_dict["children"] = list()
uniq_research_pillar_primary = set()

primary_2_interest = {}
research_pillar_primary_list = df['research_pillar_primary']
research_interest_list = df['research_discipline_primary']
name_list = df['name']
web_list = df['website_link']

interest_2_name = {}
name_2_web = {}
for index in range(0, research_pillar_primary_list.size):
    col1 = research_pillar_primary_list[index].capitalize()
    col2 = research_interest_list[index]
    col3 = name_list[index]
    col4 = web_list[index]
    # col4 may contain multiple website links, using ; to seperate, just use the first one
    first_web = col4.strip().split(';')[0]
    name_2_web[col3] = first_web
    if col1 not in primary_2_interest:
        primary_2_interest[col1] = list()
    interest = col2.strip().split(';')
    for i in interest:
        if i.strip() == "":
            continue
        i = i.strip().capitalize()
        if i not in primary_2_interest[col1]:
            primary_2_interest[col1].append(i)
        if i not in interest_2_name:
            interest_2_name[i] = list()
        if col3 not in interest_2_name[i]:
            interest_2_name[i].append(col3)

#print(primary_2_interest)


for col in sorted(df['research_pillar_primary']):
    col = col.capitalize()
    if col not in uniq_research_pillar_primary:
        uniq_research_pillar_primary.add(col)
        interest_list = list()
        for interest in sorted(primary_2_interest[col]):
            name_list = list()
            for name in sorted(interest_2_name[interest]):
                name_list.append({"name": name, "url": name_2_web[name]})
            interest_list.append({"name": interest, "children": name_list})
        final_dict["children"].append({"name": col, "children": interest_list})

result = json.dumps(final_dict, indent = 2)

# Writing to sample.json
with open("research-tree.js", "w") as outfile:
    outfile.write("export const research_tree_data = %s" % result)

#按行读取
# for index, row in df.iterrows():
#     print(index, row)
    
    # cols = row.strip().split(',')
    # if len(cols) > 0 and cols[0] != '' and cols[0].find('id') == -1:
    #     #ResearchInterest: print(cols[14])
    #     #Area:print(cols[15])
    #     #Name: print(cols[3])
    #     #websitelink: print(cols[11])
    #     print(cols[15])
    #     if ori_name not in ori_2_area:
    #         ori_2_area[ori_name] = list()
    #     if cols[15] not in ori_2_area[ori_name]:
    #         ori_2_area[ori_name].append(cols[15])

#print(ori_2_area)
#knowledge_dict = {'name': 'ResearchArea', 'children': area_list}