import express from "express";

import authRoute from "./modules/Auths/auth.route";
import userRoute from "./modules/Users/user.route";
import workspaceRoute from "./modules/Workspaces/workspace.route";
import workspaceMemberRoute from "./modules/Workspace_Members/workspace-member";
import projectRoute from "./modules/Projects/project.route";
import taskRoute from "./modules/Tasks/task.route";
import labelRoute from "./modules/Labels/label.route";

const app = express();

app.use(express.json());

app.use("/auth", authRoute);

app.use("/users", userRoute);

app.use("/workspaces", workspaceRoute);

app.use("/workspace-members", workspaceMemberRoute);

app.use("/projects", projectRoute);

app.use("/tasks", taskRoute);

app.use("/labels", labelRoute);

app.get("/health", (req, res) => {

    res.json({

        status: "ok"

    });

});

export default app;