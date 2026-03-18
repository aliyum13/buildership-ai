import sql from "../configs/db.js";

// ========== PROJECT MANAGEMENT ==========

// Create a new business project
export const createProject = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { project_name, description, industry, stage } = req.body;

        const [project] = await sql`
            INSERT INTO business_projects (user_id, project_name, description, industry, stage) 
            VALUES (${userId}, ${project_name}, ${description}, ${industry}, ${stage || 'ideation'})
            RETURNING *
        `;

        res.json({ success: true, project });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Get all user projects
export const getUserProjects = async (req, res) => {
    try {
        const { userId } = req.auth();

        const projects = await sql`
            SELECT * FROM business_projects 
            WHERE user_id = ${userId} 
            ORDER BY created_at DESC
        `;

        res.json({ success: true, projects });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get single project with tasks
export const getProjectDetails = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { id } = req.params;

        const [project] = await sql`
            SELECT * FROM business_projects 
            WHERE id = ${id} AND user_id = ${userId}
        `;

        if (!project) {
            return res.json({ success: false, message: "Project not found" });
        }

        const tasks = await sql`
            SELECT * FROM tasks 
            WHERE project_id = ${id} AND user_id = ${userId}
            ORDER BY 
                CASE priority 
                    WHEN 'high' THEN 1 
                    WHEN 'medium' THEN 2 
                    WHEN 'low' THEN 3 
                END,
                due_date ASC NULLS LAST
        `;

        const documents = await sql`
            SELECT * FROM business_documents
            WHERE project_id = ${id} AND user_id = ${userId}
            ORDER BY created_at DESC
        `;

        res.json({ success: true, project, tasks, documents });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Update project
export const updateProject = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { id } = req.params;
        const { project_name, description, industry, stage, status } = req.body;

        const [project] = await sql`
            UPDATE business_projects 
            SET 
                project_name = COALESCE(${project_name}, project_name),
                description = COALESCE(${description}, description),
                industry = COALESCE(${industry}, industry),
                stage = COALESCE(${stage}, stage),
                status = COALESCE(${status}, status),
                updated_at = NOW()
            WHERE id = ${id} AND user_id = ${userId}
            RETURNING *
        `;

        if (!project) {
            return res.json({ success: false, message: "Project not found" });
        }

        res.json({ success: true, project });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Delete project
export const deleteProject = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { id } = req.params;

        await sql`
            DELETE FROM business_projects 
            WHERE id = ${id} AND user_id = ${userId}
        `;

        res.json({ success: true, message: "Project deleted successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ========== TASK MANAGEMENT ==========

// Create task
export const createTask = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { project_id, title, description, priority, due_date } = req.body;

        const [task] = await sql`
            INSERT INTO tasks (project_id, user_id, title, description, priority, due_date) 
            VALUES (${project_id}, ${userId}, ${title}, ${description || null}, ${priority || 'medium'}, ${due_date || null})
            RETURNING *
        `;

        res.json({ success: true, task });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get project tasks
export const getProjectTasks = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { project_id } = req.params;

        const tasks = await sql`
            SELECT * FROM tasks 
            WHERE project_id = ${project_id} AND user_id = ${userId}
            ORDER BY 
                CASE priority 
                    WHEN 'high' THEN 1 
                    WHEN 'medium' THEN 2 
                    WHEN 'low' THEN 3 
                END,
                due_date ASC NULLS LAST
        `;

        res.json({ success: true, tasks });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Update task
export const updateTask = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { id } = req.params;
        const { title, description, priority, status, due_date } = req.body;

        const [task] = await sql`
            UPDATE tasks 
            SET 
                title = COALESCE(${title}, title),
                description = COALESCE(${description}, description),
                priority = COALESCE(${priority}, priority),
                status = COALESCE(${status}, status),
                due_date = COALESCE(${due_date}, due_date),
                updated_at = NOW()
            WHERE id = ${id} AND user_id = ${userId}
            RETURNING *
        `;

        if (!task) {
            return res.json({ success: false, message: "Task not found" });
        }

        res.json({ success: true, task });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Delete task
export const deleteTask = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { id } = req.params;

        await sql`
            DELETE FROM tasks 
            WHERE id = ${id} AND user_id = ${userId}
        `;

        res.json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};