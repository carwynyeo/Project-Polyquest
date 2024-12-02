import pandas as pd
import csv

file_path = "./data/combined-school-courses.csv"
df = pd.read_csv(file_path)


def sanitize_string(s):
    return s.strip().replace("&", "and").replace("  ", " ")


df["course_name"] = df["course_name"].apply(sanitize_string)
unique_courses_df_sanitized = (
    df[["course_name"]].drop_duplicates().reset_index(drop=True)
)

output_file_path = "./data/unique-courses.csv"
unique_courses_df_sanitized.to_csv(
    output_file_path, index=False, quoting=csv.QUOTE_NONE, escapechar="\\"
)
