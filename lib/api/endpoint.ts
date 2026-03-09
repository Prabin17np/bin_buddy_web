// ─── API Endpoint  

export const API = {
  AUTH: {
    LOGIN:                  "/auth/login",
    REGISTER:               "/auth/register",
    UPDATE_PROFILE:         "/auth/update-profile",          
    UPLOAD_IMAGE:           "/auth/upload-image",            
    CHANGE_PASSWORD:        "/auth/change-password",         
    REQUEST_PASSWORD_RESET: "/auth/request-password-reset", 
    RESET_PASSWORD: (token: string) => `/auth/reset-password/${token}`, 
  },

  ADMIN: {
    USER: {
      GET_ALL: "/admin/users",                               
      GET_ONE: (id: string) => `/admin/users/${id}`,         // GET  → { success, data: User }
      CREATE:  "/admin/users",                               // POST — multer: "profilePicture"
      UPDATE:  (id: string) => `/admin/users/${id}`,         // PUT  — multer: "profilePicture"
      DELETE:  (id: string) => `/admin/users/${id}`,         // DELETE
    },
    REPORT: {
      GET_ALL: "/admin/reports",                             // GET  → { success, data: Report[] } userId populated
      UPDATE:  (id: string) => `/admin/reports/${id}`,       // PATCH { status }
    },
    MESSAGE: {
  GET_ALL:              "/admin/messages",                        
  CREATE:               "/admin/messages",                        
  REPLY: (id: string) => `/admin/messages/${id}/reply`,          
},
TRASH_LOG: {
      GET_ALL: "/admin/trash-logs",
      STATS:   "/admin/trash-logs/stats",
      CREATE:  "/admin/trash-logs",
  DELETE:  (id: string) => `/admin/trash-logs/${id}`,
    },
  },

  USER: {
    CURRENT:     "/user/me",                               
    MESSAGES:    "/user/messages",                           
    REPLY:       "/user/messages/reply",                    
    REPORTS:     "/user/reports", 
    TRASH_LOG: {
      GET_ALL: "/user/trash-logs",
      STATS:   "/user/trash-logs/stats",
      CREATE:  "/user/trash-logs",
      DELETE:  (id: string) => `/user/trash-logs/${id}`,
    },
   TIP: {
  GET_ALL: "/user/tips",           
  GET_ONE: (id: string) => `/user/tips/${id}`, 
  ASK_AI: "/user/tips/ask",        
},                        
   
  },
  
};