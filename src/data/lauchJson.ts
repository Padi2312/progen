export const launchJson = {
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "attach",
            "name": "Attach Debug",
            "port": 4321,
            "restart": true,
            "processId": "${command:PickProcess}",
        },
        {
            "type": "node",
            "request": "launch",
            "name": "Launch Debug",
            "cwd": "${workspaceRoot}",
            "runtimeExecutable": "npm",
            "runtimeArgs": [
                "run",
                "start:debug"
            ]
        }
    ]
}