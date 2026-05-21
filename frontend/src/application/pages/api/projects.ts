import { ProjectsInjectorService } from '@application/services/ProjectsInjectorService';

export const GET = async () => {
    const service = new ProjectsInjectorService();

    try {
        const projects = await service.getAllProjects('name');
        return new Response(JSON.stringify(projects), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return new Response(
            JSON.stringify({
                error: 'Failed to fetch projects',
            }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }
};
