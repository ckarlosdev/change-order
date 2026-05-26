export type ChangeOrder = {
  id: number | null;
  jobId: number | null;
  employeeId: number | null;
  orderDate: string;
  orderNumber: number;
  amount: number;
  orderStatus: string;
  tasks: Task[];
  signatures: Signature[];
};

export type Signature = {
  id: number;
  signatureRole: string;
  filePath: string;
}

export type Task = {
  temporalId: string;
  id: number | null;
  taskName: string;
  taskDescription: string;
  foreman: number;
  labor: number;
  other: number;
  totalHours: number;
  comments: string;
  equipmentComments: string;
  toolComments: string;
  dumpsterComments: string;
  equipments: TaskEquipment[];
  tools: TaskTool[];
  dumpsters: TaskDumpster[];
};

export type TaskEquipment = {
  temporalId: string;
  id: number | null;
  equipmentName: string;
  quantity: number;
};

export type TaskTool = {
  temporalId: string;
  id: number | null;
  toolName: string;
  quantity: number;
};

export type TaskDumpster = {
  temporalId: string;
  id: number | null;
  materialType: string;
  dumpsterSize: string; // 12 yrds, 20... Semi, gondola
  quantity: number;
};

export type User = {
  id: number;
  fullName: string;
  email: string;
  roles: Role[];
};

export type Role = {
  id: number;
  name: string;
};

export type Job = {
  jobsId: number | null;
  number: string;
  type: string;
  name: string;
  address: string;
  contractor: string;
  contact: string;
  status: string;
};

export type Employee = {
  employeesId: number;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  status: string;
  title: string;
};
