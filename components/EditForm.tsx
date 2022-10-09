import { Input, TextArea } from './base/Form';
import Card from './base/Card';

export default function EditForm({
  blog,
  register,
  handleSubmit,
  formState,
  setValue,
  onSubmitForm,
  control
}: any) {
  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="w-full space-y-8">
      <Card className="bg-white sm:rounded">
        <div className="p-8 border-b md:col-span-1">
          <div className="text-lg font-medium leading-6 text-gray-900">Blog Settings</div>
          <div className="mt-2 text-sm text-gray-500">
            This information is the most prominent information displayed publicly on your
            blog.{' '}
          </div>
        </div>
        <div className="p-8 mt-5 space-y-6 border-b md:mt-0 md:col-span-2">
          {defaultBaseInputs.map((input: any) => (
            <input.component
              {...input}
              label={input.label}
              name={input.id}
              register={register}
              key={input.id}
              error={formState?.errors[input.id]}
              setValue={setValue}
              placeholder={input?.placeholder || ''}
              helper={input?.helper || ''}
              control={control}
            />
          ))}
        </div>
        <div className="p-8 border-b md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Notion integration
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            This is your Notion database ID. You can find it in the URL of your database.
          </p>
        </div>

        <div className="p-8 mt-5 space-y-6 md:mt-0 md:col-span-2">
          {JsonSettings.map(input => (
            <input.component
              {...input}
              label={input.label}
              name={input.id}
              register={register}
              key={input.id}
              error={formState?.errors[input.id]}
              setValue={setValue}
            />
          ))}
        </div>
        <div className="flex justify-end p-8 space-x-4">
          <button
            type="submit"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-black border border-transparent rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <div>{blog?.slug ? 'Update blog' : ' Create blog'}</div>
          </button>
        </div>
      </Card>
    </form>
  );
}

const defaultBaseInputs = [
  {
    id: 'slug',
    label: 'Blogfolio domain',
    component: Input,
    placeholder: '',
    helper: '',
    suffix: '.blogfolio.co'
  },
  {
    id: 'notionBlogDatabaseId',
    label: 'Notion blog database id',
    component: Input,
    placeholder: '',
    helper: (
      <div>
        <div>
          You can clone this template to get started:{' '}
          <a
            href="https://phung.notion.site/6a05e6e596ac4bc6b591734f5c3d9850"
            target="_blank"
            rel="noreferrer"
            className="font-semibold hover:underline"
          >
            https://phung.notion.site/6a05e6e596ac4bc6b591734f5c3d9850
          </a>
        </div>
        <div className="mt-1" /> or copy this database id for
        testing <span className='font-semibold'>6a05e6e596ac4bc6b591734f5c3d9850</span>
      </div>
    )
  }
];

const JsonSettings = [
  {
    id: 'settingData',
    label: 'Setting in JSON',
    component: TextArea,
    placeholder: '',
    rows: 10,

    helper: `This is an advanced setting, you can set the blog settings in JSON format.`
  }
];
