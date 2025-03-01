# MyEasy Table 🏆

[![npm version](https://img.shields.io/npm/v/myeasy-table.svg)](https://www.npmjs.com/package/myeasy-table)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**Myeasy Table** is a fully customizable React table component with built-in sorting, pagination, and search functionality.

## 🚀 Installation

```bash
npm install myeasy-table

📌 Usage

🔹 Basic Example

import { DataTable } from "myeasy-table";
import "myeasy-table/dist/myeasy-table.css"; // Import default styles

const columns = [
  { key: "firstName", label: "First Name", sortable: true },
  { key: "lastName", label: "Last Name", sortable: true },
  { key: "email", label: "Email" },
];

const data = [
  { id: "1", firstName: "Alice", lastName: "Smith", email: "alice@example.com" },
  { id: "2", firstName: "Bob", lastName: "Johnson", email: "bob@example.com" },
];

const MyComponent = () => (
  <DataTable data={data} columns={columns} pagination sortable />
);

📌 TypeScript Usage
🔹 If you're using TypeScript, you need to explicitly define your column types:

import { DataTable } from "myeasy-table";
import "myeasy-table/dist/myeasy-table.css";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

const columns: { key: keyof User; label: string; sortable?: boolean }[] = [
  { key: "firstName", label: "First Name", sortable: true },
  { key: "lastName", label: "Last Name", sortable: true },
  { key: "email", label: "Email" },
];

const data: User[] = [
  { id: "1", firstName: "Alice", lastName: "Smith", email: "alice@example.com" },
  { id: "2", firstName: "Bob", lastName: "Johnson", email: "bob@example.com" },
];

const MyComponent = () => (
  <DataTable data={data} columns={columns} pagination sortable />
);

💡 Note: The columns prop must use keyof YourType to ensure TypeScript compatibility.


🎯 Available Props

| Prop        | Type                        | Description                                    |Required |
|------------|----------------------------|--------------------------------------------------|---------|
| `data`     | `T[]`                       | The dataset to be displayed                     | ✅ Yes |
| `columns`  | `ColumnDef<T>[]`            | Column definitions                              | ✅ Yes |
| `sortable` | `boolean` (default: `true`) | Enables/disables sorting                        | ❌ No |
| `pagination` | `boolean` (default: `true`) | Enables/disables pagination                   | ❌ No |
| `onRowClick` | `(row: T) => void`        | Callback triggered when clicking a row          | ❌ No |
| `onDelete` | `(id: string) => void`      | Callback to delete a row (adds a delete button) | ❌ No |


🎨 Custom Styling
By default, myeasy-table comes with built-in styles.
To override them, simply add custom CSS rules in your project.

Example:
/* Custom styles */
.table {
  background-color: lightgray; /* Example: Change table background */
  border-radius: 10px;
  border: 2px solid black;
}

🔥 Advanced Example
With row click handling and row deletion:

const handleRowClick = (row) => {
  console.log("Row clicked:", row);
};

const handleDelete = (id) => {
  console.log("Deleting item with ID:", id);
};

<DataTable 
  data={data} 
  columns={columns} 
  onRowClick={handleRowClick} 
  onDelete={handleDelete} 
  sortable 
  pagination 
/>

📜 License
This project is licensed under the MIT License.
