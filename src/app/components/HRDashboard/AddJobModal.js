import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

function AddJobModal({ formData, setFormData, onSubmit }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Job</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <JobForm formData={formData} setFormData={setFormData} />
        <div className="flex justify-end mt-4">
          <Button onClick={onSubmit}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
