const saveToFile = (name: string, contents: BlobPart): void => {
    const a = document.createElement('a');
    const url = URL.createObjectURL(new Blob([contents]));

    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => {
        window.URL.revokeObjectURL(url);
    }, 0);
};

export default saveToFile;
