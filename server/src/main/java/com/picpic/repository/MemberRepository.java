package com.picpic.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.picpic.entity.Member;

public interface MemberRepository extends JpaRepository<Member, Integer> {
}
