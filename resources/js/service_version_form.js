$(window).on('load', function () {

    $('[data-toggle="input-mask"]').each(function (idx, obj) {
        var maskFormat = $(obj).data("maskFormat");
        var reverse = $(obj).data("reverse");
        if (reverse != null) {
            $(obj).mask(maskFormat, {
                reverse: reverse,
                translation: {
                    Z: {
                        pattern: /[0-9]/,
                        optional: true
                    }
                }
            });

        }
        else {
            $(obj).mask(maskFormat, {
                translation: {
                    Z: {
                        pattern: /[0-9]/,
                        optional: true
                    }
                }
            });

        }
    });

    window.Parsley.addValidator('version', {
        requirementType: 'string',
        validateString: function (value, requirement) {
            const currentVersion = parseInt(String(requirement).split('.').join(''));
            const newVesion = parseInt(value.split('.').join(''));
            return newVesion > currentVersion;

        },
        messages: {
            en: 'New version can not be less than or equal to the current version.'

        }

    });

    window.Parsley.addValidator('filemimetypes', {
        requirementType: 'string',
        validateString: function (value, requirement, parsleyInstance) {
            var files = parsleyInstance.$element[ 0 ].files;
            var allowedMimeTypes = requirement.replace(/\s/g, "").split(',');
            let isValidFiles = [];
            Array.from(files).forEach(file => {
                console.log(file);
                isValidFiles.push(allowedMimeTypes.indexOf(file.type) !== -1)

            })
            console.log('is valid files : ', isValidFiles.every((validFile) => validFile));
            return isValidFiles.every((validFile) => validFile);

        },
        messages: {
            en: 'Not supported file type. Only .bin file is allowed.'
        }

    });

    const forms = $('form').parsley();
    forms.forEach(form => {
        form.on('form:submit', function () {
            console.log('prevent form submit');
            return false;

        });

        form.on('form:success', function (e) {

            // e.preventDefault();
            const formJ = $(e.element);
            showUploading('Uploading');
            const formData = new FormData(formJ[ 0 ]);
            console.log('form data: ');
            for (const entery of formData.entries()) {
                console.log(`${entery[ 0 ]}: ${entery[ 1 ]}`);
            }
            var url = formJ.attr('action');
            const submitBtn = formJ.find('button[type=submit]');
            submitBtn.attr('disabled', true);

            $.ajax({
                type: "POST",
                url: url,
                // dataType: 'json',
                contentType: false,
                processData: false,
                data: formData, // serializes the form's elements.
                success: (data) => {
                    // console.log(data);
                    Swal.fire({
                        title: 'Success!',
                        text: 'Updated successfully',
                        type: 'success'

                    });
                    // const responseDiv = formJ.find('.response-div');
                    // responseDiv.html(`
                    //         <div class="alert alert-success alert-dismissible border-0 fade show" role="alert">
                    //             Updated successfuly.
                    //             <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    //                 <span aria-hidden="true">×</span>
                    //             </button>
                    //         </div>
                    //     `);

                    // setTimeout(() => {
                    //     location.reload();

                    // }, 500);

                },
                error: (error) => {
                    console.log('can not update content pelase try again.');
					submitBtn.attr('disabled', false);
                    Swal.fire({
                        title: 'Error',
                        text: 'Oops! can not update. Please try again.',
                        type: 'error'

                    });
                }
            });

        });

    });

});

function showUploading(title) {
    swal({
        title: title,
        allowEscapeKey: false,
        allowOutsideClick: false,
        onOpen: () => {
            swal.showLoading();
        }
    });
};
