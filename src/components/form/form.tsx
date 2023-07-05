"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MdOutlineMail } from "react-icons/md";
import { useForm, Resolver } from "react-hook-form";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import useFirebaseAuth from "@/hooks/useFirebaseAuth";
import { useCallback, useState } from "react";
import { BsEyeSlashFill, BsEyeFill } from "react-icons/bs";
import React from "react";

export type FormInput = {
  email: string;
  password: string;
};

const resolver: Resolver<FormInput> = async (values) => {
  return {
    values: values.email && values.password ? values : {},
    errors:
      !values.email || !values.password
        ? {
            email: {
              type: "onChange",
              message: "email must not empty"
            },
            password: {
              type: "onChange",
              message: "password must not empty"
            }
          }
        : {}
  };
};

interface TFormProps {
  model: "Sign In" | "Sign Up";
}

const Form: React.FC<TFormProps> = ({ model }) => {
  const { mutationLogin, mutationRegister, errMessage, isAuthError } = useFirebaseAuth();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField
  } = useForm<FormInput>({ resolver });

  const onSubmits = handleSubmit((inputValue) => {
    if (model === "Sign In") {
      mutationLogin.mutate({ email: inputValue.email, password: inputValue.password });
    } else {
      mutationRegister.mutate({ email: inputValue.email, password: inputValue.password });
    }
  });

  const generateLoadingBooleans = useCallback(() => {
    if (mutationLogin.isLoading || mutationRegister.isLoading) {
      return true;
    }

    return false;
  }, [mutationLogin.isLoading, mutationRegister.isLoading]);

  const togglePassword = () => setShowPassword(!showPassword);

  // const getMessageFailedAuth = failedAuth()
  const loadBool = generateLoadingBooleans();

  return (
    <form onSubmit={onSubmits}>
      <div className='grid w-full items-center mt-3 gap-4'>
        <div className='flex flex-col space-y-3'>
          <Label htmlFor='email'>@ Email</Label>
          <Input
            {...register("email", { required: true })}
            className='text-slate-900'
            type='email'
            id='email'
            placeholder='Enter you email'
          />
          <span className='text-red-700 text-sm'>{errors.email ? errors.email.message : null}</span>
        </div>
        <div className='flex flex-col space-y-1.5'>
          <Label htmlFor='password'>Password</Label>

          <div className='relative'>
            <label
              className='absolute right-2 top-1 p-2 rounded-full transition duration-300 active:bg-zinc-300 cursor-pointer'
              onClick={togglePassword}>
              {showPassword ? (
                <BsEyeFill className='fill-zinc-900' />
              ) : (
                <BsEyeSlashFill className='fill-zinc-900' />
              )}
            </label>

            <Input
              {...register("password", { maxLength: 8 })}
              type={showPassword ? "text" : "password"}
              className='text-slate-900'
              id='password'
              placeholder='Enter your Password'
            />
          </div>

          <ul className='text-red-700 text-[0.632rem] list-disc pt-1'>
            {errors.password ? <li>{errors.password.message}</li> : null}
            {isAuthError ? <li>{model === "Sign In" && errMessage.split(" ").at(2)}</li> : null}
          </ul>
        </div>
        <Button
          type='submit'
          variant='default'
          className='w-full flex gap-2 justify-center mt-5'>
          {loadBool ? (
            <React.Fragment>
              <span>Please Wait</span>
              <AiOutlineLoading3Quarters className='animate-spin' />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <MdOutlineMail fontSize='1.182rem' />
              <span>{model === "Sign In" ? "Sign in" : "Sign up"}</span>
            </React.Fragment>
          )}
        </Button>
      </div>
    </form>
  );
};

export default Form;