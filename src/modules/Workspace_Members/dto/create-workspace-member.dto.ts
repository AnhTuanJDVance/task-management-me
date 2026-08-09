import { WorkspaceRole } from "../../../common/enums/workspace-role.enum";

export interface CreateWorkspaceMemberDto {

    userId: number;

    role?: WorkspaceRole;

}