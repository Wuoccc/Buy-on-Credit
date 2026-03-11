import openpyxl

wb = openpyxl.load_workbook('Mẫu.xlsx', data_only=False)
ws = wb.active

for i, row in enumerate(ws.iter_rows()):
    row_vals = []
    for cell in row:
        val = str(cell.value) if cell.value is not None else ""
        # replace newlines to keep it single line per row
        row_vals.append(val.replace('\n', ' '))
    print(f"Row {i+1}: " + " | ".join(row_vals))
