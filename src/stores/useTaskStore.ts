import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Task, TaskDumpster, TaskEquipment, TaskTool } from "../types";
import { v4 as uuidv4 } from "uuid";

type TaskStore = {
  assignedTasks: Task[];
  taskData: Task;
  showTaskModal: boolean;
  equipmentData: TaskEquipment;
  toolData: TaskTool;
  dumpsterData: TaskDumpster;

  addTask: () => void;
  resetTaskData: () => void;
  setShowTaskModal: (show: boolean) => void;
  setTaskData: <K extends keyof Task>(key: K, value: Task[K]) => void;
  removeTask: (temporalId: string) => void;
  updateTask: (tempId: string, updatedFields: Partial<Task>) => void;
  // setSelectedTaskData: (taskTempId: string) => void;

  setEquipmentData: <K extends keyof TaskEquipment>(
    key: K,
    value: TaskEquipment[K],
  ) => void;
  setToolData: <K extends keyof TaskTool>(key: K, value: TaskTool[K]) => void;
  setDumpsterData: <K extends keyof TaskDumpster>(
    key: K,
    value: TaskDumpster[K],
  ) => void;

  addEquipment: (
    taskTempId: string,
    newEquipment: Omit<TaskEquipment, "temporalId">,
  ) => void;
  // updateEquipment: (
  //   taskTempId: string,
  //   equipmentTempId: string,
  //   updatedFields: Partial<TaskEquipment>,
  // ) => void;
  removeEquipment: (taskTempId: string, equipmentTempId: string) => void;
  addTool: (taskTempId: string, newTool: Omit<TaskTool, "temporalId">) => void;
  // updateTool: (
  //   taskTempId: string,
  //   toolTempId: string,
  //   updatedFields: Partial<TaskTool>,
  // ) => void;
  removeTool: (taskTempId: string, toolTempId: string) => void;
  addDumpster: (
    taskTempId: string,
    newTool: Omit<TaskDumpster, "temporalId">,
  ) => void;
  // updateDumpster: (
  //   taskTempId: string,
  //   dumpsterTempId: string,
  //   updatedFields: Partial<TaskDumpster>,
  // ) => void;
  removeDumpster: (taskTempId: string, DumpsterId: string) => void;
  setNewTask: () => void;
  reset: () => void;
  setFullData: (data: Task[]) => void;
};

const initialData: Task = {
  temporalId: "",
  id: null,
  taskName: "",
  taskDescription: "",
  foreman: 0,
  labor: 0,
  other: 0,
  totalHours: 0,
  comments: "",
  equipmentComments: "",
  toolComments: "",
  dumpsterComments: "",
  equipments: [],
  tools: [],
  dumpsters: [],
};

const initialEquipment: TaskEquipment = {
  temporalId: "",
  id: null,
  equipmentName: "",
  quantity: 1,
};

const initialTool: TaskTool = {
  temporalId: "",
  id: null,
  toolName: "",
  quantity: 1,
};

const initialDumpster: TaskDumpster = {
  temporalId: "",
  id: null,
  materialType: "",
  dumpsterSize: "",
  quantity: 1,
};

const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      assignedTasks: [],
      taskData: initialData,
      showTaskModal: false,
      equipmentData: initialEquipment,
      toolData: initialTool,
      dumpsterData: initialDumpster,

      addTask: () =>
        set((state) => {
          const { taskData, assignedTasks } = state;
          const isEditing = assignedTasks.some(
            (t) => t.temporalId === taskData.temporalId,
          );

          let newAssignedTasks;

          if (isEditing) {
            newAssignedTasks = assignedTasks.map((t) =>
              t.temporalId === taskData.temporalId ? taskData : t,
            );
          } else {
            const taskToAdd = {
              ...taskData,
              temporalId: uuidv4(),
            };
            newAssignedTasks = [...assignedTasks, taskToAdd];
          }

          return {
            assignedTasks: newAssignedTasks,
            taskData: initialData,
          };
        }),
      resetTaskData: () =>
        set({
          taskData: initialData,
          equipmentData: initialEquipment,
          toolData: initialTool,
          dumpsterData: initialDumpster,
        }),
      setShowTaskModal: (show) => set({ showTaskModal: show }),
      setTaskData: (key, value) =>
        set((state) => ({
          taskData: {
            ...state.taskData,
            [key]: value,
          },
        })),
      removeTask: (tempId: string) =>
        set((state) => ({
          assignedTasks: state.assignedTasks.filter(
            (task) => task.temporalId !== tempId,
          ),
        })),

      updateTask: (tempId: string, updatedFields: Partial<Task>) =>
        set((state) => ({
          assignedTasks: state.assignedTasks.map(
            (task) =>
              task.temporalId === tempId
                ? { ...task, ...updatedFields } // Si coincide, creamos una copia con los nuevos campos
                : task, // Si no coincide, devolvemos la tarea original intacta
          ),
        })),
      // setSelectedTaskData: (taskTempId: string) => {
      //   const task = state.assignedTasks.find(
      //     (t) => t.temporalId === taskTempId,
      //   );
      //   if (task) {
      //     set({ taskData: task });
      //   }
      // },

      setEquipmentData: (key, value) =>
        set((state) => ({
          equipmentData: {
            ...state.equipmentData,
            [key]: value,
          },
        })),
      setToolData: (key, value) =>
        set((state) => ({
          toolData: {
            ...state.toolData,
            [key]: value,
          },
        })),
      setDumpsterData: (key, value) =>
        set((state) => ({
          dumpsterData: {
            ...state.dumpsterData,
            [key]: value,
          },
        })),

      addEquipment: (
        taskTempId: string,
        newEquipment: Omit<TaskEquipment, "temporalId">,
      ) =>
        set((state) => ({
          assignedTasks: state.assignedTasks.map((task) =>
            task.temporalId === taskTempId
              ? {
                  ...task,
                  equipments: [
                    ...task.equipments,
                    { ...newEquipment, temporalId: uuidv4() },
                  ],
                }
              : task,
          ),
          equipmentData: initialEquipment,
        })),

      // updateEquipment: (
      //   taskTempId: string,
      //   equipmentTempId: string,
      //   updatedFields: Partial<TaskEquipment>,
      // ) =>
      //   set((state) => ({
      //     assignedTasks: state.assignedTasks.map((task) =>
      //       task.temporalId === taskTempId
      //         ? {
      //             ...task,
      //             equipments: task.equipments.map((equip) =>
      //               equip.temporalId === equipmentTempId
      //                 ? { ...equip, ...updatedFields }
      //                 : equip,
      //             ),
      //           }
      //         : task,
      //     ),
      //   })),

      removeEquipment: (taskTempId: string, equipmentTempId: string) =>
        set((state) => ({
          assignedTasks: state.assignedTasks.map((task) =>
            task.temporalId === taskTempId
              ? {
                  ...task,
                  equipments: task.equipments.filter(
                    (equip) => equip.temporalId !== equipmentTempId,
                  ),
                }
              : task,
          ),
        })),

      addTool: (taskTempId: string, newTool: Omit<TaskTool, "temporalId">) =>
        set((state) => ({
          assignedTasks: state.assignedTasks.map((task) =>
            task.temporalId === taskTempId
              ? {
                  ...task,
                  tools: [...task.tools, { ...newTool, temporalId: uuidv4() }],
                }
              : task,
          ),
          toolData: initialTool,
        })),

      // updateTool: (tempId: string, updatedFields: Partial<TaskTool>) =>
      //   set((state) => ({
      //     taskData: {
      //       ...state.taskData,
      //       tools: state.taskData.tools.map((tool) =>
      //         tool.temporalId === tempId ? { ...tool, ...updatedFields } : tool,
      //       ),
      //     },
      //   })),

      removeTool: (taskTempId: string, toolTempId: string) =>
        set((state) => ({
          assignedTasks: state.assignedTasks.map((task) =>
            task.temporalId === taskTempId
              ? {
                  ...task,
                  tools: task.tools.filter(
                    (tool) => tool.temporalId !== toolTempId,
                  ),
                }
              : task,
          ),
        })),

      addDumpster: (
        taskTempId: string,
        newDumpster: Omit<TaskDumpster, "temporalId">,
      ) =>
        set((state) => ({
          assignedTasks: state.assignedTasks.map((task) =>
            task.temporalId === taskTempId
              ? {
                  ...task,
                  dumpsters: [
                    ...task.dumpsters,
                    { ...newDumpster, temporalId: uuidv4() },
                  ],
                }
              : task,
          ),
          dumpsterData: initialDumpster,
        })),

      // updateDumpster: (tempId: string, updatedFields: Partial<TaskDumpster>) =>
      //   set((state) => ({
      //     taskData: {
      //       ...state.taskData,
      //       dumpsters: state.taskData.dumpsters.map((dump) =>
      //         dump.temporalId === tempId ? { ...dump, ...updatedFields } : dump,
      //       ),
      //     },
      //   })),

      removeDumpster: (taskTempId: string, dumpsterTempId: string) =>
        set((state) => ({
          assignedTasks: state.assignedTasks.map((task) =>
            task.temporalId === taskTempId
              ? {
                  ...task,
                  dumpsters: task.dumpsters.filter(
                    (dumpster) => dumpster.temporalId !== dumpsterTempId,
                  ),
                }
              : task,
          ),
        })),

      setNewTask: () => set({ taskData: initialData }),
      reset: () => set({ assignedTasks: [], taskData: initialData }),
      setFullData: (data: any[]) => {
        const mappedTasks = data.map((task) => ({
          // Si la API ya traía un temporalId por alguna razón lo deja, si no, usa el ID real como string o genera un UUID
          ...task,
          temporalId:
            task.temporalId || task.id?.toString() || crypto.randomUUID(),

          // Hacemos lo mismo para las sublistas por si las iteras dentro de Task
          equipments:
            task.equipments?.map((eq: any) => ({
              ...eq,
              temporalId:
                eq.temporalId || eq.id?.toString() || crypto.randomUUID(),
            })) || [],

          tools:
            task.tools?.map((tl: any) => ({
              ...tl,
              temporalId:
                tl.temporalId || tl.id?.toString() || crypto.randomUUID(),
            })) || [],

          dumpsters:
            task.dumpsters?.map((dp: any) => ({
              ...dp,
              temporalId:
                dp.temporalId || dp.id?.toString() || crypto.randomUUID(),
            })) || [],
        }));

        set({ assignedTasks: mappedTasks });
      },
    }),
    {
      name: "task-storage",
    },
  ),
);

export default useTaskStore;
