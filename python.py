# convert_to_json.py - One-time conversion
import openpyxl
import json

# Load the Excel file
wb = openpyxl.load_workbook('prices.xlsx')
sheet = wb.active

# Get headers from the first row
headers = [cell.value for cell in sheet[1]]

# Read data rows
data = []
for row in sheet.iter_rows(min_row=2, values_only=True):
    row_dict = dict(zip(headers, row))
    data.append(row_dict)

# Save as JSON
with open('prices.json', 'w') as f:
    json.dump(data, f, indent=2)

print("Converted to prices.json")

# Created by Copilot AI and DeepSeek