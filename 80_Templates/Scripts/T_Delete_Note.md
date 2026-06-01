<%*
const file = app.workspace.getActiveFile();
if (!file) {
    new Notice("No hay archivo activo para eliminar.");
} else {
    const confirm = await tp.system.suggester(
        ["🗑️ Sí, eliminar", "Cancelar"],
        [true, false]
    );
    if (confirm) {
        await app.vault.trash(file, false);
        new Notice("Archivo eliminado.");
    }
}
%>