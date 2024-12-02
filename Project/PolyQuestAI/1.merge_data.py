import pandas as pd

school1 = pd.read_csv("./data/school-data/NP_FT_COURSE.csv")
school2 = pd.read_csv("./data/school-data/NYP_FT_COURSE.csv")
school3 = pd.read_csv("./data/school-data/RP_FT_COURSE.csv")
school4 = pd.read_csv("./data/school-data/SP_FT_COURSE.csv")
school5 = pd.read_csv("./data/school-data/TP_FT_COURSE.csv")

columns_needed = [
    # "school_name", - Removed so that we can combine all schools bvy unique course name
    "year",
    "course_code",
    "course_name",
    # "course_description", - Not all schools has this
    "reference",
]

school1 = school1[columns_needed]
school2 = school2[columns_needed]
school3 = school3[columns_needed]
school4 = school4[columns_needed]
school5 = school5[columns_needed]

all_schools_combined = pd.concat(
    [school1, school2, school3, school4, school5], ignore_index=True
)

all_schools_combined.to_csv("./data/combined-school-courses.csv", index=False)
