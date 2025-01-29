/*
  # Create users trigger

  1. Purpose
    - Automatically create a user record in the public.users table when a new auth.users record is created
    - This ensures the foreign key constraint for tasks.created_by is satisfied

  2. Changes
    - Create function to handle user creation
    - Create trigger to execute function on auth.user insert
*/

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();