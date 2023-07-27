
import json
import copy

# set the path to input (the original data) and output (the transformed data)
path_in = r"C:\Users\sd540\Desktop\Division Portal\Interdisciplinary-Knowledge-Map-DKU\js\02-16-2023\\" # original
path_out = r"C:\Users\sd540\Desktop\Division Portal\Interdisciplinary-Knowledge-Map-DKU\js\07-24-2023\\" # transformed

# make sure these js files are json files (no var names)
with open(path_in + "research-faculty.js") as f:
    research_faculty_data = json.load(f)
with open(path_in + "teaching.js") as f:
    teaching_data = json.load(f)

# get all nodes and links
node_dict_all = research_faculty_data["nodes"] + teaching_data["nodes"]

link_dict_all = research_faculty_data["links"] + teaching_data["links"]




# assign values and repitition times for links
js_key_dict = {
    "research-faculty":{
        "nodes": ["PrimaryResearchPillar", "Faculty", "ResearchInterest"],
        "links": [{"research_pillar_primary": [10, 4]}, {"has_interest": [5, 1]}]
    },
    # "research-area":{
    #     "nodes": ["PrimaryResearchPillar", "Faculty_notshown", "ResearchInterest_shown"],
    #     "links": [{"research_pillar_primary": [10, 4]}, {"has_interest": [1, 1]}]
    # },
    "teaching":{
        "nodes": ["Center_MajorSupport", "ParentPrimaryMajorSupport", "PrimaryMajorSupport", "Faculty_notshown"],
        "links": [{"parent_primary_major_center_to": [50, 1]}, {"has_parent_primary_major": [30, 1]}, 
                  {"support_major_primary": [20, 1]}]
    }
}


for file_name in js_key_dict.keys(): # for each data 

    target_node_list, target_link_list = [], []

    var_name = "graph_" + file_name.replace("-", "_")

    node_list = js_key_dict[file_name]["nodes"]
    link_dict_list = js_key_dict[file_name]["links"]

    # get targeted nodes
    for node_label in node_list:
        # get all nodes with the same label
        for node in node_dict_all:
            if node["labels"][0] == node_label:
                target_node_list.append(node)

    # get targeted links
    for link_dict in link_dict_list:
        for k, v in link_dict.items():
            link_label = k
            link_value = v[0]
            link_repeated = v[1]
            link_extracted_list = []
            # get all links with the same "type"
            for link in link_dict_all:
                if link["type"] == link_label:
                    link_extracted_list.append(link)

            # repeat
            for i in range(link_repeated):
                target_link_list += link_extracted_list
            
            # add value
            for link in target_link_list:
                link["value"] = link_value
                
    res_js = {"nodes": target_node_list, "links": target_link_list}

    # save as js, start with "var data = "
    with open(path_out + file_name + ".js", "w") as f:
        f.write("var {} = ".format(var_name))
        json.dump(res_js, f, indent=4)